# Prajin Dezaa — Production-Ready Global Portfolio & Web Platform

A dark, cinematic, multi-page international developer portfolio and digital platform engineered for global search visibility (Google, Bing, Yandex, Baidu, Naver, and AI engines).

**Owner:** Prajin Dezaa — Theni, Tamil Nadu, India  
**LinkedIn:** [prajin-dezaa-a3469543b](https://www.linkedin.com/in/prajin-dezaa-a3469543b) · **Instagram:** [@cricketerprajin06](https://www.instagram.com/prajin_studio.in/"I build websites & apps that grow businesses."*

---

## 1. Project Overview & Architecture

This repository has been fully upgraded from a single-file prototype into an enterprise-grade, multi-page static web application with pre-rendered semantic HTML, modular CSS/JS, 11-language internationalization, Core Web Vitals optimization, and multi-host deployment pipelines.

```
prajin-portfolio/
├── site.config.json           ← Single source of truth (Domain, Host, Verification, i18n)
├── package.json               ← NPM scripts (build, dev, set-config, audit, deploy:check)
├── src/                       ← Raw source code
│   ├── index.html             ← Pre-rendered English Homepage
│   ├── about/index.html       ← Dedicated About Me page
│   ├── process/index.html     ← 4-Step Engineering Process page
│   ├── faq/index.html         ← Dedicated FAQ & pricing page
│   ├── contact/index.html     ← Dedicated Contact inquiry page
│   ├── privacy/index.html     ← GDPR/DPDP compliant Privacy Policy
│   ├── terms/index.html       ← Commercial Terms of Service
│   ├── 404.html               ← Helpful custom 404 page
│   ├── services/              ← 7 Dedicated Service Pages
│   │   ├── website-development/
│   │   ├── ecommerce-development/
│   │   ├── b2b-order-management-apps/
│   │   ├── android-apps-and-pwa/
│   │   ├── custom-software-development/
│   │   ├── ui-ux-and-landing-pages/
│   │   └── seo-and-digital-ads/
│   ├── work/                  ← 3 Verified Production Case Studies
│   │   ├── kalasam-jaikrishna-industries/
│   │   ├── jki-orders-b2b-platform/
│   │   └── aparna-stores-ecommerce/
│   ├── blog/                  ← 6 Launch Articles (1,200+ words each)
│   ├── markets/               ← 7 Country-Specific Market Pages (USA, UK, UAE, Australia, Canada, Singapore, Germany)
│   ├── hi/, ta/, ar/, es/, fr/, de/, pt-br/, id/, ms/, ja/ ← 10 International Language Hubs
│   ├── assets/
│   │   ├── css/main.css       ← Master CSS Design System (RTL + Dark/Light Theme)
│   │   ├── js/main.js         ← Progressive enhancement, Three.js 3D WebGL, Lenis, GSAP
│   │   └── images/            ← Standalone WebP/JPEG image assets
│   ├── llms.txt               ← AI Search Engine Manifesto (ChatGPT, Perplexity, Gemini)
│   ├── humans.txt             ← Team and standards declaration
│   ├── manifest.webmanifest   ← PWA installable manifest
│   └── .well-known/security.txt
├── tools/                     ← Production build & audit utilities
│   ├── build.mjs              ← Master build pipeline (copies src → dist, replaces tokens)
│   ├── generate-all.mjs       ← Regenerates all semantic HTML pages from data
│   ├── set-config.mjs         ← Interactive configuration CLI
│   ├── audit.mjs              ← Technical SEO, H1, Schema, and Hreflang validator
│   ├── dev-server.mjs         ← Zero-dependency local preview server
│   └── ping-indexnow.mjs      ← Instant search engine notification script
├── .github/workflows/         ← GitHub Actions workflow (pages.yml)
├── SEO-AUDIT.md               ← Before/After audit benchmarks
├── SEO-CHECKLIST.md           ← Complete implementation checklist
├── KEYWORD-MAP.csv            ← Multi-market keyword research matrix
├── CONTENT-CALENDAR.md        ← 12-month topical publishing schedule
├── OUTREACH-TEMPLATES.md      ← White-hat backlink and PR pitch templates
├── SEO-REPORT-TEMPLATE.md     ← Monthly client reporting dashboard
├── MANUAL-TASKS.md            ← Verification and account setup checklist
└── DEPLOY.md                  ← Step-by-step deploy guide for all 4 hosts
```

---

## 2. Quick Start & Local Preview

Run the development preview server:
```bash
npm run build
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to explore all 42 pre-rendered pages, the 3D WebGL scene, and language variants.

---

## 3. When You Have Your Domain & Host (3-Step Deploy)

Follow this exact guide once you register your live domain:

### Step 1: Set Your Production Configuration
Run the interactive CLI:
```bash
npm run set-config
```
Enter your domain (e.g. `https://prajindezaa.com`) and choose your host (**Cloudflare Pages**, **Vercel**, **Netlify**, or **GitHub Pages**).

### Step 2: Build & Verify
```bash
npm run build:prod
npm run deploy:check
```
This guarantees zero remaining `{{...}}` tokens and confirms that all canonicals, schemas, sitemaps, and robots directives point to your live domain.

### Step 3: Publish to Your Host
Deploy the `dist/` directory to your chosen hosting platform according to the instructions in [DEPLOY.md](file:///c:/Users/Admin/Downloads/prajin-portfolio/prajin-portfolio/DEPLOY.md).

---

## 4. Key Performance & SEO Features

1. **100% Pre-Rendered Static HTML:** Zero reliance on client-side JavaScript for content discovery. Search engines and AI crawlers index full text upon initial HTTP response.
2. **Core Web Vitals Optimized:** Base64 image bloat removed, external Google Fonts render-blocking eliminated, Three.js 3D WebGL scene deferred to idle callbacks.
3. **Connected JSON-LD Graph:** Rich `Person`, `ProfessionalService`, `OfferCatalog`, `BreadcrumbList`, and `Article` schemas cross-linked with `@id`.
4. **Worldwide International Reach:** Reciprocal `hreflang` clusters supporting 11 languages with native `dir="rtl"` support for Arabic.
5. **AI Search Ready:** Dedicated `/llms.txt` file formatted specifically for ChatGPT search, Perplexity, Claude, and Gemini Copilot answer engines.
