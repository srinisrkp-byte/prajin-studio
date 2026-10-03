import fs from 'fs';
import path from 'path';

// Schema Factory for Prajin Dezaa Portfolio
export function generateSchemaGraph({
  pageType = 'WebPage',
  pagePath = '/',
  pageTitle,
  pageDesc,
  breadcrumbs = [],
  services = [],
  caseStudy = null,
  article = null,
  faqItems = []
}) {
  const canonicalUrl = `{{DOMAIN}}${pagePath}`;
  const personId = `{{DOMAIN}}/#person`;
  const orgId = `{{DOMAIN}}/#organization`;
  const websiteId = `{{DOMAIN}}/#website`;

  const graph = [];

  // 1. Person Entity
  graph.push({
    "@type": "Person",
    "@id": personId,
    "name": "Prajin Dezaa",
    "jobTitle": "Full-Stack Developer & Software Engineer",
    "description": "Full-stack developer from Theni, Tamil Nadu, India. Specializing in high-performance business websites, B2B ordering platforms, e-commerce stores, Android PWAs, and technical SEO.",
    "url": "{{DOMAIN}}/",
    "email": "mailto:{{EMAIL}}",
    "telephone": "+919360970236",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Theni",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.linkedin.com/in/prajin-dezaa-a3469543b?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      "https://www.instagram.com/prajin_studio.in/",
        "https://www.facebook.com/profile.php?id=61594798122881",
      "{{GITHUB}}"
    ],
    "knowsAbout": [
      "Web Development",
      "Progressive Web Apps",
      "Android Development",
      "Full-Stack Software Architecture",
      "Technical SEO",
      "E-Commerce Architecture",
      "Three.js and WebGL",
      "B2B Order Management Systems"
    ]
  });

  // 2. ProfessionalService / Organization Entity
  graph.push({
    "@type": "ProfessionalService",
    "@id": orgId,
    "name": "Prajin and Team — Full-Stack Web & App Development Studio",
    "url": "{{DOMAIN}}/",
    "logo": "{{DOMAIN}}/assets/images/logo.png",
    "image": "{{DOMAIN}}/assets/images/logo.png",
    "founder": { "@id": personId },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Worldwide"
    },
    "priceRange": "$$",
    "telephone": "+919360970236",
    "email": "{{EMAIL}}",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Theni",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Full-Stack Digital Product Services",
      "itemListElement": services.map((s, idx) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": s.name,
          "description": s.short,
          "url": `{{DOMAIN}}/services/${s.slug}/`
        }
      }))
    }
  });

  // 3. WebSite Entity
  graph.push({
    "@type": "WebSite",
    "@id": websiteId,
    "url": "{{DOMAIN}}/",
    "name": "Prajin and Team Portfolio",
    "publisher": { "@id": orgId },
    "inLanguage": "en"
  });

  // 4. Current WebPage Entity
  const webPageEntity = {
    "@type": pageType,
    "@id": `${canonicalUrl}#webpage`,
    "url": canonicalUrl,
    "name": pageTitle,
    "description": pageDesc,
    "isPartOf": { "@id": websiteId },
    "about": { "@id": personId }
  };
  graph.push(webPageEntity);

  // 5. BreadcrumbList (if applicable)
  if (breadcrumbs && breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      "itemListElement": breadcrumbs.map((b, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": b.name,
        "item": `{{DOMAIN}}${b.path}`
      }))
    });
  }

  // 6. Case Study CreativeWork / SoftwareApplication
  if (caseStudy) {
    graph.push({
      "@type": caseStudy.slug.includes('platform') || caseStudy.slug.includes('app') ? "SoftwareApplication" : "CreativeWork",
      "@id": `${canonicalUrl}#caseStudy`,
      "name": caseStudy.name,
      "headline": caseStudy.h1,
      "description": caseStudy.solution,
      "creator": { "@id": personId },
      "url": caseStudy.url,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All modern browsers, Android, Windows, macOS",
      "provider": { "@id": orgId }
    });
  }

  // 7. Article Schema (for Blog Posts)
  if (article) {
    graph.push({
      "@type": "Article",
      "@id": `${canonicalUrl}#article`,
      "headline": article.title,
      "description": article.excerpt,
      "datePublished": article.date,
      "dateModified": article.date,
      "author": { "@id": personId },
      "publisher": { "@id": personId },
      "mainEntityOfPage": canonicalUrl,
      "image": "{{DOMAIN}}/assets/images/og-default.jpg"
    });
  }

  // 8. FAQPage Schema (Strictly where visible)
  if (faqItems && faqItems.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item[0],
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item[1]
        }
      }))
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
