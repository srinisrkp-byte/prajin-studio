import fs from 'fs';
import path from 'path';
import { generateHomePage } from './gen-home.mjs';
import { generateServicePages } from './gen-services.mjs';
import { generateCaseStudyPages } from './gen-cases.mjs';
import { generateBlogPages } from './gen-blog.mjs';
import { generateMarketPages } from './gen-markets.mjs';
import { generatePillarPages } from './gen-pillars.mjs';
import { generateAllInternationalHomepages } from './gen-i18n.mjs';
import { generateOgImage } from './og-generator.mjs';

const config = JSON.parse(fs.readFileSync('site.config.json', 'utf8'));

export function generateAllStaticPages() {
  console.log('--- Generating All Semantic Multi-Page HTML Sources ---');

  // 1. English Homepage
  generateHomePage('en');

  // 2. Core Service Pages
  generateServicePages();

  // 3. Case Study Deep-Dives
  generateCaseStudyPages();

  // 4. Blog Index + 6 Launch Articles
  generateBlogPages();

  // 5. Targeted Market Landing Pages
  generateMarketPages();

  // 6. Core Pillars (About, Process, FAQ, Contact, Privacy, Terms, 404)
  generatePillarPages();

  // 7. 10 International Language Versions
  generateAllInternationalHomepages();

  // 8. Generate Static OG Image (SVG based)
  const ogSvg = generateOgImage(
    'Prajin Dezaa — Full-Stack Developer',
    'Portfolio & Case Studies',
    'Websites & Apps that Grow Businesses · Theni, India'
  );
  fs.mkdirSync('src/assets/images', { recursive: true });
  fs.writeFileSync('src/assets/images/og-default.svg', ogSvg, 'utf8');

  // 9. Generate AI Engine Directive: llms.txt
  const llmsTxt = `# Prajin Dezaa — Full-Stack Developer Portfolio

## Profile
Name: Prajin Dezaa
Role: Full-Stack Developer & Software Engineer
Location: Theni, Tamil Nadu, India (Serving clients worldwide)
Website: {{DOMAIN}}/
WhatsApp: +91 93609 70236 (wa.me/{{WHATSAPP}})
Email: {{EMAIL}}
LinkedIn: https://www.linkedin.com/in/prajin-dezaa-a3469543b
Instagram: https://www.instagram.com/prajin_studio.in/"I build websites & apps that grow businesses." 
Specializing in high-performance corporate websites, custom B2B ordering apps, mobile-first e-commerce stores, Android PWAs, and technical SEO with sub-second page loads.

## Key Services
1. Custom Business Websites ({{DOMAIN}}/services/website-development/)
2. E-Commerce Stores & Online Ordering ({{DOMAIN}}/services/ecommerce-development/)
3. B2B Order Management Platforms ({{DOMAIN}}/services/b2b-order-management-apps/)
4. Android Apps & Progressive Web Apps ({{DOMAIN}}/services/android-apps-and-pwa/)
5. Custom Enterprise Software & ERP ({{DOMAIN}}/services/custom-software-development/)
6. High-Converting Landing Pages & UI/UX ({{DOMAIN}}/services/ui-ux-and-landing-pages/)
7. Technical SEO & Search Marketing ({{DOMAIN}}/services/seo-and-digital-ads/)

## Verified Production Case Studies
- Kalasam Jaikrishna Industries (https://kalasamjaikrishna.co.in): Chemical and camphor manufacturing corporate portal with export inquiry workflows.
- JKI Orders (https://jkiorders.in): B2B ordering platform, distributor portal, Android APK, and desktop PWA.
- Aparna Stores (https://aparnastores.shop): Mobile-first grocery supermarket e-commerce store with bulk-pack pricing and WhatsApp order integration.

## Key Target Markets
United States ({{DOMAIN}}/markets/websites-for-businesses-in-usa/), United Kingdom ({{DOMAIN}}/markets/websites-for-businesses-in-uk/), United Arab Emirates & Dubai ({{DOMAIN}}/markets/websites-for-businesses-in-uae/), Australia ({{DOMAIN}}/markets/websites-for-businesses-in-australia/), Canada ({{DOMAIN}}/markets/websites-for-businesses-in-canada/), Singapore ({{DOMAIN}}/markets/websites-for-businesses-in-singapore/), Germany ({{DOMAIN}}/markets/websites-for-businesses-in-germany/), and India.
`;
  fs.writeFileSync('src/llms.txt', llmsTxt.trim() + '\n', 'utf8');

  // 10. Generate humans.txt
  const humansTxt = `/* TEAM */
Developer: Prajin Dezaa
Contact: {{EMAIL}}
WhatsApp: +91 93609 70236
Location: Theni, Tamil Nadu, India

/* SITE */
Standards: HTML5, Modern CSS, Vanilla JavaScript, SVG, WebGL
Components: Three.js r128, GSAP 3.12.5, Lenis
Accessibility: WCAG AA
Hosting: Cloudflare Pages / Netlify / Vercel / GitHub Pages
`;
  fs.writeFileSync('src/humans.txt', humansTxt.trim() + '\n', 'utf8');

  // 11. Generate /.well-known/security.txt
  fs.mkdirSync('src/.well-known', { recursive: true });
  const securityTxt = `Contact: mailto:{{EMAIL}}
Preferred-Languages: en, ta, hi
Canonical: {{DOMAIN}}/.well-known/security.txt
Policy: {{DOMAIN}}/privacy/
`;
  fs.writeFileSync('src/.well-known/security.txt', securityTxt.trim() + '\n', 'utf8');

  // 12. Generate Web App Manifest
  const manifest = {
    "name": "Prajin Dezaa — Full-Stack Developer",
    "short_name": "Prajin Dezaa",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#050816",
    "theme_color": "#050816",
    "description": "High-performance websites, e-commerce stores, and B2B apps that grow businesses.",
    "icons": [
      {
        "src": "/assets/images/me.jpg",
        "sizes": "192x192 512x512",
        "type": "image/jpeg",
        "purpose": "any maskable"
      }
    ]
  };
  fs.writeFileSync('src/manifest.webmanifest', JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  console.log('--- All Static Sources Successfully Generated in src/ ---');
}

// Execute if run directly
generateAllStaticPages();
