import fs from 'fs';
import path from 'path';

const config = JSON.parse(fs.readFileSync('site.config.json', 'utf8'));
const services = JSON.parse(fs.readFileSync('src/data/services.json', 'utf8'));
const cases = JSON.parse(fs.readFileSync('src/data/cases.json', 'utf8'));
const posts = JSON.parse(fs.readFileSync('src/data/posts.json', 'utf8'));
const markets = JSON.parse(fs.readFileSync('src/data/markets.json', 'utf8'));
const i18nEn = JSON.parse(fs.readFileSync('src/data/i18n/en.json', 'utf8'));

// Determine root prefix relative to current page path
export function getRootRel(pagePath) {
  const depth = pagePath.replace(/^\//, '').replace(/\/$/, '').split('/').filter(Boolean).length;
  return depth === 0 ? './' : '../'.repeat(depth);
}

// Generate hreflang tags for any given page
export function renderHreflangTags(pagePath) {
  // If homepage or root language variant
  const isHome = pagePath === '/' || pagePath === '';
  const lines = [];

  // Default x-default points to base English page
  lines.push(`<link rel="alternate" hreflang="x-default" href="{{DOMAIN}}${pagePath}">`);
  lines.push(`<link rel="alternate" hreflang="en" href="{{DOMAIN}}${pagePath}">`);

  if (isHome) {
    for (const lang of config.languages) {
      if (lang.code !== 'en') {
        lines.push(`<link rel="alternate" hreflang="${lang.code}" href="{{DOMAIN}}/${lang.code}/">`);
      }
    }
  }

  return lines.join('\n    ');
}

// Generate Standard Head
export function renderHead({
  title,
  metaDesc,
  pagePath,
  ogType = 'website',
  ogImage = '/assets/images/og-default.jpg',
  lang = 'en',
  dir = 'ltr',
  schemaJson = null,
  isArticle = false
}) {
  const rootRel = getRootRel(pagePath);
  const canonicalUrl = `{{DOMAIN}}${pagePath}`;
  const fullTitle = title.includes('Prajin and Team') ? title : `${title} — Prajin and Team`;

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${fullTitle}</title>
  <meta name="description" content="${metaDesc}">
  <link rel="canonical" href="${canonicalUrl}">
  ${renderHreflangTags(pagePath)}

  <!-- Search Engine Verifications -->
  <meta name="google-site-verification" content="{{GOOGLE_VERIFICATION}}">
  <meta name="msvalidate.01" content="{{BING_VERIFICATION}}">
  <meta name="yandex-verification" content="{{YANDEX_VERIFICATION}}">
  <meta name="baidu-site-verification" content="{{BAIDU_VERIFICATION}}">
  <meta name="naver-site-verification" content="{{NAVER_VERIFICATION}}">

  <!-- Open Graph / Facebook / LinkedIn -->
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${fullTitle}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="${config.siteName}">
  <meta property="og:image" content="{{DOMAIN}}${ogImage}">
  <meta property="og:locale" content="${config.languages.find(l => l.code === lang)?.locale || 'en_US'}">

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${fullTitle}">
  <meta name="twitter:description" content="${metaDesc}">
  <meta name="twitter:image" content="{{DOMAIN}}${ogImage}">

  <!-- Favicon & PWA Manifest -->
  <link rel="icon" type="image/png" href="${rootRel}assets/images/logo.png">
  <link rel="apple-touch-icon" href="${rootRel}assets/images/logo.png">
  <link rel="manifest" href="${rootRel}manifest.webmanifest">
  <meta name="theme-color" content="#050816">

  <!-- Stylesheet -->
  <link rel="stylesheet" href="${rootRel}assets/css/main.css">

  <!-- Structured Data (JSON-LD) -->
  ${schemaJson ? `<script type="application/ld+json">\n${JSON.stringify(schemaJson, null, 2)}\n  </script>` : ''}
</head>
<body class="nc">
  <a class="skip" href="#main-content">Skip to content</a>
  <div id="bar"></div>
  <div class="cur"></div>
  <div class="dot"></div>
  <div class="mesh" aria-hidden="true"></div>
  <canvas id="gl" aria-hidden="true"></canvas>
`;
}

// Generate Header Navigation
export function renderHeader(pagePath, lang = 'en') {
  const rootRel = getRootRel(pagePath);
  const isHome = pagePath === '/' || pagePath === `/${lang}/`;

  return `  <header>
    <nav aria-label="Main navigation">
      <a class="logo mag brand-logo-link" href="${rootRel}" aria-label="Prajin and Team — Home">
        <img class="nav-emblem" src="${rootRel}assets/images/nav-emblem.png" alt="Prajin and Team Emblem" width="36" height="36" fetchpriority="high">
        <span class="brand-text">
          <span class="brand-title">prajin<b>&</b>team</span>
          <span class="brand-sub">FULL-STACK STUDIO</span>
        </span>
      </a>
      <div class="links" id="links">
        <a href="${isHome ? '#work' : rootRel + '#work'}">Work</a>
        <a href="${isHome ? '#services' : rootRel + '#services'}">Services</a>
        <a href="${rootRel}about/">About</a>
        <a href="${rootRel}process/">Process</a>
        <a href="${rootRel}faq/">FAQ</a>
        <a href="${rootRel}blog/">Blog</a>
        <a href="${rootRel}contact/">Contact</a>
        <a class="mh" href="${rootRel}contact/">Hire us →</a>
      </div>

      <!-- Language Switcher -->
      <div class="lang-wrap">
        <button class="lang-btn mag" id="langBtn" aria-label="Change language">
          🌐 <span>${lang.toUpperCase()}</span> ▾
        </button>
        <div class="lang-menu" id="langMenu">
          <a href="${rootRel}" class="${lang === 'en' ? 'active' : ''}">English</a>
          <a href="${rootRel}hi/" class="${lang === 'hi' ? 'active' : ''}">हिन्दी (Hindi)</a>
          <a href="${rootRel}ta/" class="${lang === 'ta' ? 'active' : ''}">தமிழ் (Tamil)</a>
          <a href="${rootRel}ar/" class="${lang === 'ar' ? 'active' : ''}">العربية (Arabic)</a>
          <a href="${rootRel}es/" class="${lang === 'es' ? 'active' : ''}">Español (Spanish)</a>
          <a href="${rootRel}fr/" class="${lang === 'fr' ? 'active' : ''}">Français (French)</a>
          <a href="${rootRel}de/" class="${lang === 'de' ? 'active' : ''}">Deutsch (German)</a>
          <a href="${rootRel}pt-br/" class="${lang === 'pt-br' ? 'active' : ''}">Português (Brasil)</a>
          <a href="${rootRel}id/" class="${lang === 'id' ? 'active' : ''}">Bahasa Indonesia</a>
          <a href="${rootRel}ms/" class="${lang === 'ms' ? 'active' : ''}">Bahasa Melayu</a>
          <a href="${rootRel}ja/" class="${lang === 'ja' ? 'active' : ''}">日本語 (Japanese)</a>
        </div>
      </div>

      <button class="btn ic mag" id="theme" aria-label="Toggle light or dark mode">◐</button>
      <a class="btn p s mag hire" href="${rootRel}contact/">Hire us</a>
      <button class="btn ic burger" id="bg" aria-label="Open menu" aria-expanded="false">☰</button>
    </nav>
  </header>
`;
}

// Generate Footer
export function renderFooter(pagePath) {
  const rootRel = getRootRel(pagePath);
  return `  <footer>
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-col">
          <p class="logo" style="margin-bottom:12px;"><img class="nav-logo" src="${rootRel}assets/images/logo.png" alt="Prajin and Team Logo" width="32" height="32"><span>prajin<b>&</b>team</span></p>
          <p style="max-width:32ch; line-height:1.6; margin-bottom:16px;">
            Full-stack engineering and design studio led by Prajin from Theni, Tamil Nadu, India. Building high-performance websites, e-commerce stores, B2B portals, and custom cloud software worldwide.
          </p>
          <p><strong>WhatsApp:</strong> <a href="https://wa.me/{{WHATSAPP}}" target="_blank" rel="noopener">+91 93609 70236</a></p>
          <p><strong>Email:</strong> <a href="mailto:{{EMAIL}}">{{EMAIL}}</a></p>
        </div>

        <div class="footer-col">
          <h4>Services</h4>
          <ul>
            <li><a href="${rootRel}services/website-development/">Business Websites</a></li>
            <li><a href="${rootRel}services/ecommerce-development/">E-Commerce Stores</a></li>
            <li><a href="${rootRel}services/b2b-order-management-apps/">B2B Order Portals</a></li>
            <li><a href="${rootRel}services/android-apps-and-pwa/">Android Apps & PWA</a></li>
            <li><a href="${rootRel}services/custom-software-development/">Custom Software / ERP</a></li>
            <li><a href="${rootRel}services/ui-ux-and-landing-pages/">Landing Pages & UI/UX</a></li>
            <li><a href="${rootRel}services/seo-and-digital-ads/">SEO & Google/Meta Ads</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Case Studies</h4>
          <ul>
            <li><a href="${rootRel}work/kalasam-jaikrishna-industries/">Kalasam Industries (Export)</a></li>
            <li><a href="${rootRel}work/jki-orders-b2b-platform/">JKI Orders (B2B Platform)</a></li>
            <li><a href="${rootRel}work/aparna-stores-ecommerce/">Aparna Stores (E-Commerce)</a></li>
          </ul>
          <h4 style="margin-top:24px;">Company</h4>
          <ul>
            <li><a href="${rootRel}about/">About Us</a></li>
            <li><a href="${rootRel}process/">4-Step Process</a></li>
            <li><a href="${rootRel}faq/">Frequently Asked Questions</a></li>
            <li><a href="${rootRel}blog/">Engineering Blog</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Global Markets</h4>
          <ul>
            <li><a href="${rootRel}markets/websites-for-businesses-in-usa/">United States</a></li>
            <li><a href="${rootRel}markets/websites-for-businesses-in-uk/">United Kingdom</a></li>
            <li><a href="${rootRel}markets/websites-for-businesses-in-uae/">UAE & Dubai</a></li>
            <li><a href="${rootRel}markets/websites-for-businesses-in-australia/">Australia</a></li>
            <li><a href="${rootRel}markets/websites-for-businesses-in-canada/">Canada</a></li>
            <li><a href="${rootRel}markets/websites-for-businesses-in-singapore/">Singapore</a></li>
            <li><a href="${rootRel}markets/websites-for-businesses-in-germany/">Deutschland (Germany)</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© <span id="yr">${new Date().getFullYear()}</span> Prajin and Team · Theni, Tamil Nadu, India. All rights reserved.</span>
        <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
          <a href="${rootRel}privacy/">Privacy Policy</a>
          <a href="${rootRel}terms/">Terms of Service</a>
          <a href="${rootRel}sitemap.xml">XML Sitemap</a>
          <a href="${config.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          <a href="${config.instagram}" target="_blank" rel="noopener">Instagram</a>
          <a href="https://www.facebook.com/profile.php?id=61594798122881" target="_blank" rel="noopener" aria-label="Prajin Studio on Facebook">Facebook</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Floating Authentic WhatsApp Button -->
  <a class="wa mag" id="wa" href="https://wa.me/{{WHATSAPP}}?text=Hi%20Prajin%2C%20I%20saw%20your%20portfolio%20and%20want%20to%20discuss%20a%20project." target="_blank" rel="noopener" aria-label="Chat with Prajin and Team on WhatsApp">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="32" height="32" fill="#ffffff" aria-hidden="true">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
    </svg>
    <span class="wa-tooltip"><span class="wa-online"></span>Chat on WhatsApp</span>
  </a>

  <!-- Deferred Scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lenis/1.1.13/lenis.min.js" defer></script>
  <script src="${rootRel}assets/js/main.js" defer></script>
</body>
</html>
`;
}
