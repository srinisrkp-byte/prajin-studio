import fs from 'fs';
import path from 'path';
import { renderHead, renderHeader, renderFooter, getRootRel } from './layout.mjs';
import { generateSchemaGraph } from './schema.mjs';

const services = JSON.parse(fs.readFileSync('src/data/services.json', 'utf8'));

export function generatePillarPages() {
  const pages = [
    {
      slug: 'about',
      title: 'About Prajin Dezaa — Full-Stack Developer & Software Engineer',
      h1: '17, from Theni. <span class="g">Shipping like a studio.</span>',
      metaDesc: 'Learn about Prajin Dezaa, a full-stack developer from Theni, Tamil Nadu, India. Specializing in high-performance business websites, B2B software, and technical SEO.',
      content: `
        <h2>My Background & Philosophy</h2>
        <p>
          I am Prajin Dezaa, a full-stack developer based in Theni, Tamil Nadu, India. I started building websites and custom applications for local businesses and quickly realized that modern businesses do not need another bloated WordPress template or expensive agency retainer—they need lean, sub-second digital products that solve operational bottlenecks and bring in qualified international buyers.
        </p>
        <p>
          I operate as an end-to-end engineering partner: taking complete responsibility for discovery, UI/UX design, clean code architecture, cloud hosting deployment, and search engine optimization.
        </p>

        <h2>Core Engineering Values</h2>
        <ul>
          <li><strong>Speed:</strong> Sub-second page loads, quick development sprints, and rapid direct WhatsApp responses.</li>
          <li><strong>Craft & Quality:</strong> Semantic HTML5, modern CSS tokens, zero framework bloat, and tested on real mobile devices.</li>
          <li><strong>Honesty:</strong> Clear scope, transparent fixed pricing upfront, and complete client ownership of code and domains.</li>
        </ul>

        <h2>Verified Online Presence & Credentials</h2>
        <p>
          Connect with me directly across verified developer platforms:
        </p>
        <ul>
          <li><a href="https://www.linkedin.com/in/prajin-dezaa-a3469543b?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener" style="color:var(--c1); text-decoration:underline;">LinkedIn Profile</a></li>
          <li><a href="https://www.instagram.com/prajin_studio.in/" target="_blank" rel="noopener" style="color:var(--c1); text-decoration:underline;">Instagram Profile</a></li>
          <li><a href="https://wa.me/{{WHATSAPP}}" target="_blank" rel="noopener" style="color:var(--c1); text-decoration:underline;">Direct WhatsApp (+91 93609 70236)</a></li>
        </ul>
      `
    },
    {
      slug: 'process',
      title: 'Engineering Process — From Idea to Growth | Prajin Dezaa',
      h1: 'A Transparent, 4-Step <span class="g">Engineering Process</span>',
      metaDesc: 'Learn how Prajin Dezaa delivers custom websites and B2B software from discovery to launch and search optimization.',
      content: `
        <h2>How We Build Together</h2>
        <p>
          Successful digital engineering requires structured communication and predictable milestones. Here is the exact 4-step workflow I use on every client engagement:
        </p>

        <h3>01. Discover & Scope</h3>
        <p>
          We begin with an in-depth discovery call discussing your business model, target audience, competitors, and functional requirements. I map out a precise project scope, delivery schedule, and transparent fixed quote.
        </p>

        <h3>02. Wireframing & Design Approval</h3>
        <p>
          Before writing any production code, I produce high-fidelity responsive layouts matching your brand identity. You review and approve the design, typography, and conversion funnels.
        </p>

        <h3>03. Clean Code Development</h3>
        <p>
          I develop your application using clean, lightweight semantic code (HTML5, Vanilla CSS, modern JavaScript, or Next.js where appropriate). You receive private staging preview links to test functionality on real devices as features are built.
        </p>

        <h3>04. Launch, SEO & Growth</h3>
        <p>
          I handle domain connection, SSL provisioning, edge CDN configuration, and search engine verification (Google, Bing, Yandex, Baidu, Naver). Finally, we configure technical SEO and advertising campaigns to drive high-intent inquiries.
        </p>
      `
    },
    {
      slug: 'faq',
      title: 'Frequently Asked Questions | Prajin Dezaa',
      h1: 'Good Questions, <span class="g">Honest Answers.</span>',
      metaDesc: 'Answers to common questions about pricing, timelines, hosting ownership, technology stacks, and post-launch maintenance.',
      content: `
        <h2>Clear Answers on Pricing, Timelines & Ownership</h2>
        <details open>
          <summary>How much does a custom business website or app cost?</summary>
          <p>Every project is unique. Websites start from competitive custom quotes based on scope; e-commerce platforms and B2B ordering portals are quoted after a free discovery session. You always receive a transparent, fixed-price proposal with no hidden fees.</p>
        </details>
        <details open>
          <summary>How long does development take?</summary>
          <p>Standard corporate websites take 1 to 2 weeks. Custom B2B ordering portals, Android PWAs, and e-commerce stores typically take 3 to 8 weeks depending on backend database complexity.</p>
        </details>
        <details open>
          <summary>Who owns the website and code after launch?</summary>
          <p>You own 100% of everything: source code, domain name, hosting accounts, and media assets. There are zero licensing lock-ins or proprietary hosting dependencies.</p>
        </details>
        <details open>
          <summary>What post-launch warranty and support do you provide?</summary>
          <p>Every launch includes 30 days of free technical support and bug fixes. Thereafter, I offer flexible monthly maintenance plans covering security, performance audits, and feature enhancements.</p>
        </details>
        <details>
          <summary>Can you redesign an existing slow website?</summary>
          <p>Yes. I frequently migrate slow, bloated WordPress or DIY builder websites into lightweight, lightning-fast custom platforms that score 95+ on Google Mobile Lighthouse.</p>
        </details>
      `
    },
    {
      slug: 'contact',
      title: 'Contact Prajin Dezaa — Start Your Digital Project',
      h1: 'Let’s Build Something <span class="g">Great Together.</span>',
      metaDesc: 'Get in touch with full-stack developer Prajin Dezaa for a free discovery consultation and upfront project proposal.',
      content: `
        <h2>Direct Developer Communication</h2>
        <p>
          Whether you need a new corporate website, an e-commerce platform, a B2B ordering app, or technical SEO optimization, I'm here to help. Reach out directly via WhatsApp or submit the inquiry form below.
        </p>
        <div style="display:flex; gap:16px; flex-wrap:wrap; margin:24px 0 40px;">
          <a class="btn p mag" href="https://wa.me/{{WHATSAPP}}?text=Hi%20Prajin%2C%20I%20want%20to%20discuss%20a%20new%20project." target="_blank" rel="noopener">Chat on WhatsApp ↗</a>
          <a class="btn mag" href="mailto:{{EMAIL}}">Email: {{EMAIL}}</a>
        </div>
        <div class="card" style="padding:32px;">
          <h3 style="font-size:22px; margin-bottom:16px;">Send a Direct Project Message</h3>
          <form id="form" data-wa="{{WHATSAPP}}">
            <input id="fn" placeholder="Your name / Company name" aria-label="Your name" required>
            <textarea id="fm" rows="4" placeholder="Tell me about what you would like to build..." aria-label="Your message" required></textarea>
            <button class="btn p mag" type="submit">Submit Inquiry via WhatsApp</button>
          </form>
        </div>
      `
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy — Prajin Dezaa Portfolio',
      h1: 'Privacy <span class="g">Policy</span>',
      metaDesc: 'Privacy policy for the portfolio website of Prajin Dezaa. Explains how data is handled with complete transparency.',
      content: `
        <h2>Commitment to Data Privacy</h2>
        <p>Last updated: October 2026</p>
        <p>
          This website ({{DOMAIN}}) is operated by Prajin Dezaa, located in Theni, Tamil Nadu, India. I am deeply committed to preserving visitor privacy and adhering to global data protection regulations including the EU/UK GDPR, California CCPA, and India Digital Personal Data Protection (DPDP) Act.
        </p>
        <h2>Information Collected & Usage</h2>
        <p>
          This site does not use invasive third-party tracking cookies or sell your personal data. When you submit an inquiry form or initiate a WhatsApp message, your contact details are used solely to communicate regarding your requested project.
        </p>
        <h2>Third-Party Services</h2>
        <p>
          Hosting is powered by secure edge Content Delivery Networks (Cloudflare / Vercel / Netlify) which process basic anonymized server request logs to defend against DDoS attacks and ensure optimal server performance.
        </p>
      `
    },
    {
      slug: 'terms',
      title: 'Terms of Service — Prajin Dezaa Portfolio',
      h1: 'Terms of <span class="g">Service</span>',
      metaDesc: 'Terms of service governing the use of Prajin Dezaa portfolio website and professional consulting proposals.',
      content: `
        <h2>Website Terms & Conditions</h2>
        <p>Last updated: October 2026</p>
        <p>
          By accessing and viewing this website ({{DOMAIN}}), you agree to standard internet usage practices. All project case studies, client trademarks, and original code snippets are protected by copyright.
        </p>
        <h2>Commercial Engagements & Proposals</h2>
        <p>
          All commercial projects and development scopes are governed by individual, mutually agreed-upon client service agreements specifying deliverables, milestone payments, timelines, and intellectual property transfer upon final payment.
        </p>
      `
    },
    {
      slug: '404',
      title: '404 Page Not Found — Prajin Dezaa',
      h1: 'Page <span class="g">Not Found</span> (404)',
      metaDesc: 'The page you requested could not be found on Prajin Dezaa portfolio.',
      content: `
        <h2>Looks like you ventured off the map.</h2>
        <p>The page you are looking for has been moved, renamed, or does not exist.</p>
        <div style="margin-top:32px; display:flex; gap:16px; flex-wrap:wrap;">
          <a class="btn p mag" href="{{DOMAIN}}/">Return to Homepage →</a>
          <a class="btn mag" href="{{DOMAIN}}/#services">Explore Services</a>
          <a class="btn mag" href="{{DOMAIN}}/#work">View Case Studies</a>
          <a class="btn mag" href="{{DOMAIN}}/contact/">Contact Prajin</a>
        </div>
      `
    }
  ];

  for (const p of pages) {
    const is404 = p.slug === '404';
    const pagePath = is404 ? '/404.html' : `/${p.slug}/`;
    const rootRel = getRootRel(pagePath);

    const breadcrumbs = is404 ? [] : [
      { name: 'Home', path: '/' },
      { name: p.slug.charAt(0).toUpperCase() + p.slug.slice(1), path: pagePath }
    ];

    const schema = is404 ? null : generateSchemaGraph({
      pageType: 'WebPage',
      pagePath,
      pageTitle: p.title,
      pageDesc: p.metaDesc,
      breadcrumbs,
      services
    });

    const bodyContent = `
    <main id="main-content">
      <div class="page-header">
        <div class="wrap" style="max-width:860px;">
          ${!is404 ? `
          <nav class="breadcrumbs" aria-label="Breadcrumb navigation">
            <a href="${rootRel}">Home</a>
            <span class="sep">/</span>
            <span class="curr">${p.slug.charAt(0).toUpperCase() + p.slug.slice(1)}</span>
          </nav>
          ` : ''}
          <h1 style="max-width:24ch; margin-bottom:16px;">${p.h1}</h1>
          <p class="lead" style="font-size:20px; max-width:68ch;">${p.metaDesc}</p>
        </div>
      </div>

      <div class="page-body">
        <div class="wrap" style="max-width:860px;">
          <div class="prose">
            ${p.content}
          </div>
        </div>
      </div>
    </main>
    `;

    const html = renderHead({
      title: p.title,
      metaDesc: p.metaDesc,
      pagePath,
      schemaJson: schema
    }) + renderHeader(pagePath) + bodyContent + renderFooter(pagePath);

    const outPath = is404 ? '404.html' : `${p.slug}/index.html`;
    fs.mkdirSync(path.dirname(path.join('src', outPath)), { recursive: true });
    fs.writeFileSync(path.join('src', outPath), html.trim() + '\n', 'utf8');
    console.log(`Generated: src/${outPath}`);
  }
}
