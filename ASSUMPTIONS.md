# Key Assumptions & Defaults Log

This document records all baseline assumptions, sensible fallbacks, and design decisions made to ensure the portfolio is 100% production-ready without inventing false metrics, prices, client quotes, or fake reviews.

---

## 1. Contact & Social Profiles
- **WhatsApp Phone:** `919360970236` (pre-configured from user request). Token: `{{WHATSAPP}}` in build.
- **Email:** `prajindezaa142@gmail.com` (pre-configured from user request). Token: `{{EMAIL}}` in build.
- **LinkedIn:** `https://www.linkedin.com/in/prajin-dezaa-a3469543b?utm_source=share_via&utm_content=profile&utm_medium=member_android`
- **Instagram:** `https://www.instagram.com/prajin_studio.in/"Starting from a customized package based on scope — contact for fixed upfront quote."*
  - International Equivalent Guide: USD benchmark ($450+ - $1,500+) with localized currencies (INR, GBP, EUR, AED, CAD, AUD, SGD) provided as general industry reference ranges.
  - Call to Action: *"Get a free discovery call & fixed quote"*.

---

## 3. Real Projects & Client Case Studies
Only the 3 real, verified client projects are featured:
1. **Kalasam Jaikrishna Industries (`kalasamjaikrishna.co.in`)**:
   - Camphor & chemical manufacturer, established 1995, exporting to 17+ countries.
   - Deliverables: Corporate export catalog, OEM & distributor quote flows, SEO, WhatsApp integration.
2. **JKI Orders (`jkiorders.in`)**:
   - B2B ordering platform, distributor portal, Android APK, and desktop PWA.
   - Deliverables: Repeat order system, PIN/phone login, GST invoices, dispatch and statement tracking.
3. **Aparna Stores (`aparnastores.shop`)**:
   - Supermarket & grocery business in Theni since 1965.
   - Deliverables: Mobile-first online grocery shop, bulk quantity pack discounts, cart, checkout, order tracking.

---

## 4. Host Configurations & Staging Protection
- All 4 static hosts (**Cloudflare Pages**, **Netlify**, **Vercel**, **GitHub Pages**) are simultaneously configured with native header and redirect rule files (`_headers`, `_redirects`, `vercel.json`, and `.github/workflows/pages.yml`).
- Staging / Non-Production Protection:
  - If built without `--production` or while domain is set to `http://localhost`, `<meta name="robots" content="noindex, nofollow">` is injected and `robots.txt` outputs `Disallow: /` to prevent accidental staging indexing.
  - Production build (`npm run build -- --production`) generates full `Allow: /`, canonical absolute URLs, and comprehensive XML sitemaps.

---

## 5. International Translations & Cultural Adaptation
- Content translated natively across 11 languages (English, Hindi, Tamil, Arabic, Spanish, French, German, Portuguese-Brazil, Indonesian, Bahasa Melayu, Japanese).
- Arabic employs native `dir="rtl"` with mirrored margins and padding.
- Translations are provided in modular i18n JSON files for seamless maintenance and proofreading.
