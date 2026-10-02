import fs from 'fs';
import path from 'path';

// Master Build Pipeline for Prajin Dezaa Portfolio
// Usage: node tools/build.mjs [--production]

const isProduction = process.argv.includes('--production');
const config = JSON.parse(fs.readFileSync('site.config.json', 'utf8'));

console.log(`\n==================================================`);
console.log(`Building Portfolio in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT / STAGING'} mode...`);
console.log(`Domain: ${config.domain}`);
console.log(`Host: ${config.host}`);
console.log(`==================================================\n`);

// 1. Ensure fresh dist directory
fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist', { recursive: true });

// Helper to load .env file if present
function loadEnv() {
  const env = {};
  if (fs.existsSync('.env')) {
    const lines = fs.readFileSync('.env', 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        env[key] = val;
      }
    }
  }
  return env;
}

const envVars = loadEnv();

// 2. Token mapping dictionary
const tokenMap = {
  '{{DOMAIN}}': isProduction ? config.domain.replace(/\/$/, '') : 'http://localhost:3000',
  '{{HOST}}': config.host || 'Cloudflare Pages',
  '{{WHATSAPP}}': config.whatsapp || '919360970236',
  '{{EMAIL}}': config.email || 'prajindezaa142@gmail.com',
  '{{GITHUB}}': config.github || 'https://github.com/prajindezaa',
  '{{GOOGLE_VERIFICATION}}': isProduction ? config.verification.google || '' : '',
  '{{BING_VERIFICATION}}': isProduction ? config.verification.bing || '' : '',
  '{{YANDEX_VERIFICATION}}': isProduction ? config.verification.yandex || '' : '',
  '{{BAIDU_VERIFICATION}}': isProduction ? config.verification.baidu || '' : '',
  '{{NAVER_VERIFICATION}}': isProduction ? config.verification.naver || '' : '',
  '{{GA4_MEASUREMENT_ID}}': isProduction ? config.analytics.googleAnalyticsId || '' : '',
  '{{INDEXNOW_KEY}}': config.analytics.indexNowKey || 'prajinindexnowkey2026',
  '{{GEMINI_API_KEY}}': process.env.GEMINI_API_KEY || envVars.GEMINI_API_KEY || ''
};

// 3. Recursive copy and token replacement function
const allPagesForSitemap = [];

function processDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      processDir(srcPath, destPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      const isText = ['.html', '.css', '.js', '.mjs', '.json', '.txt', '.webmanifest', '.svg', '.xml'].includes(ext);

      if (isText) {
        let content = fs.readFileSync(srcPath, 'utf8');

        // Apply Token Replacements
        for (const [token, value] of Object.entries(tokenMap)) {
          content = content.replaceAll(token, value);
        }

        // Handle Non-production noindex injection
        if (ext === '.html') {
          if (!isProduction || config.domain.includes('localhost') || config.domain.includes('{{DOMAIN}}')) {
            // Inject staging noindex
            if (!content.includes('noindex')) {
              content = content.replace('</head>', '  <meta name="robots" content="noindex, nofollow">\n</head>');
            }
          }

          // Inject Google Analytics GA4 script if configured
          if (tokenMap['{{GA4_MEASUREMENT_ID}}']) {
            const gaId = tokenMap['{{GA4_MEASUREMENT_ID}}'];
            const gaScript = `  <!-- Google tag (gtag.js) -->\n  <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>\n  <script>\n    window.dataLayer = window.dataLayer || [];\n    function gtag(){dataLayer.push(arguments);}\n    gtag('js', new Date());\n    gtag('config', '${gaId}');\n  </script>\n</head>`;
            content = content.replace('</head>', gaScript);
          }

          // Cache busting query string for CSS and JS assets
          const buildTimestamp = Date.now();
          content = content.replaceAll('assets/css/main.css', `assets/css/main.css?v=${buildTimestamp}`);
          content = content.replaceAll('assets/css/chatbot.css', `assets/css/chatbot.css?v=${buildTimestamp}`);
          content = content.replaceAll('assets/js/main.js', `assets/js/main.js?v=${buildTimestamp}`);
          content = content.replaceAll('assets/js/chatbot.js', `assets/js/chatbot.js?v=${buildTimestamp}`);

          // Register for sitemap if valid HTML page and not 404
          const relDist = path.relative('dist', destPath).replace(/\\/g, '/');
          if (relDist !== '404.html') {
            const urlPath = '/' + relDist.replace(/index\.html$/, '');
            allPagesForSitemap.push(urlPath === '//' ? '/' : urlPath);
          }
        }

        fs.writeFileSync(destPath, content, 'utf8');
      } else {
        // Binary file (jpg, png, woff2, etc.)
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

// Process src -> dist
processDir('src', 'dist');
console.log('✓ Successfully processed all source files from src/ to dist/');

// 4. Generate Production or Staging robots.txt
const robotsTxt = isProduction && !config.domain.includes('localhost') && !config.domain.includes('{{DOMAIN}}')
  ? `# Robots.txt for Prajin Dezaa Portfolio (${config.domain})
User-agent: *
Allow: /

# Allow AI Search & Answer Engine Crawlers
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: CCBot
Allow: /

# Sitemaps
Sitemap: ${config.domain.replace(/\/$/, '')}/sitemap.xml
Sitemap: ${config.domain.replace(/\/$/, '')}/sitemap-index.xml
`
  : `# Staging / Dev robots.txt — Disallow indexing on non-production
User-agent: *
Disallow: /
`;

fs.writeFileSync('dist/robots.txt', robotsTxt.trim() + '\n', 'utf8');
console.log('✓ Generated dist/robots.txt');

// 5. Generate Comprehensive XML Sitemap
const liveDomain = isProduction ? config.domain.replace(/\/$/, '') : 'http://localhost:3000';
const today = new Date().toISOString().split('T')[0];

const uniquePages = [...new Set(allPagesForSitemap)].sort();

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${uniquePages.map(p => {
  const isHome = p === '/';
  const priority = isHome ? '1.0' : p.startsWith('/services/') ? '0.9' : p.startsWith('/work/') ? '0.85' : p.startsWith('/markets/') ? '0.8' : '0.7';
  const changefreq = isHome ? 'daily' : 'weekly';

  const links = isHome
    ? '\n    ' + config.languages.map(l => `<xhtml:link rel="alternate" hreflang="${l.code}" href="${liveDomain}${l.code === 'en' ? '/' : `/${l.code}/`}"/>`).join('\n    ')
    : '';

  return `  <url>
    <loc>${liveDomain}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${links}
  </url>`;
}).join('\n')}
</urlset>
`;

fs.writeFileSync('dist/sitemap.xml', sitemapXml.trim() + '\n', 'utf8');

// Sitemap Index
const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${liveDomain}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;
fs.writeFileSync('dist/sitemap-index.xml', sitemapIndexXml.trim() + '\n', 'utf8');
console.log(`✓ Generated dist/sitemap.xml and dist/sitemap-index.xml with ${uniquePages.length} URLs`);

// 6. Generate Host Specific Files (Zero Rework for Cloudflare, Netlify, Vercel, GitHub Pages)

// A. Cloudflare Pages / Netlify _headers
const headersContent = `/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'self';

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=3600, must-revalidate

/sitemap.xml
  Cache-Control: public, max-age=3600

/robots.txt
  Cache-Control: public, max-age=3600
`;
fs.writeFileSync('dist/_headers', headersContent.trim() + '\n', 'utf8');

// B. Cloudflare Pages / Netlify _redirects
const redirectsContent = `# Canonical trailing slash normalization & 301 mappings
/home               /                   301
/index              /                   301
`;
fs.writeFileSync('dist/_redirects', redirectsContent.trim() + '\n', 'utf8');

// C. Vercel vercel.json
const vercelJson = {
  "cleanUrls": true,
  "trailingSlash": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "status": 404, "dest": "/404.html" }
  ]
};
fs.writeFileSync('dist/vercel.json', JSON.stringify(vercelJson, null, 2) + '\n', 'utf8');

// D. Netlify netlify.toml
const netlifyToml = `[build]
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
`;
fs.writeFileSync('dist/netlify.toml', netlifyToml.trim() + '\n', 'utf8');

// E. GitHub Pages CNAME (if host is GitHub Pages and domain is custom)
if (config.host === 'GitHub Pages' && isProduction && !config.domain.includes('github.io') && !config.domain.includes('{{DOMAIN}}')) {
  const domainOnly = config.domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  fs.writeFileSync('dist/CNAME', domainOnly + '\n', 'utf8');
}

// 7. Check for leftover {{...}} tokens in production mode
if (isProduction) {
  console.log('\n--- Auditing dist/ for leftover {{...}} tokens ---');
  let leftoverFound = false;

  function scanForTokens(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const f of files) {
      const full = path.join(dir, f.name);
      if (f.isDirectory()) {
        scanForTokens(full);
      } else {
        const ext = path.extname(f.name).toLowerCase();
        if (['.html', '.css', '.js', '.json', '.txt', '.xml'].includes(ext)) {
          const raw = fs.readFileSync(full, 'utf8');
          const matches = raw.match(/\{\{[A-Z0-9_]+\}\}/g);
          if (matches) {
            console.error(`❌ Leftover token in ${full}: ${matches.join(', ')}`);
            leftoverFound = true;
          }
        }
      }
    }
  }

  scanForTokens('dist');

  if (leftoverFound) {
    console.error('\n⚠️ Production build failed: Unresolved {{TOKEN}} placeholders exist in dist/.\nSet production values in site.config.json or run "npm run set-config" to resolve them.');
    process.exit(1);
  } else {
    console.log('✓ Zero leftover tokens found in dist/. 100% production ready!');
  }
}

console.log('\n==================================================');
console.log('Build completed successfully in dist/');
console.log('==================================================\n');
