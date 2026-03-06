# **AA Digital Business: Hybrid "Zero-Gravity" Web Architecture**

**Strategic Objective:** Establish maximum Technical Authority and Search Visibility through a high-performance Hybrid Architecture: leveraging Strapi (Headless CMS) for marketing agility and Starlight (Git-based MDX) for world-class Developer Experience.

## **1\. Architectural Diagram (Mermaid)**

graph TD  
    subgraph "Content Management (Dynamic Data)"  
        S\[Strapi Cloud / Hetzner CMS\]  
    end

    subgraph "Git Repository (Code & Docs)"  
        A\[Astro Core\] \--\> B(Astro Pages & Layouts)  
        A \--\> E\[Starlight Docs .mdx\]  
        A \--\> F(Structured Data JSON-LD)  
    end  
      
    subgraph "Build Pipeline"  
        G\[Cloudflare Pages CI/CD\]  
        A \-- Push to Main \--\> G  
        S \-- Webhook Trigger \--\> G  
        G \-- Fetch API Data \--\> S  
        G \-- SSG Compilation \--\> H\[Static HTML/CSS/JS\]  
        G \-- Search Indexing \--\> I\[Pagefind Static Search\]  
    end  
      
    subgraph "Edge Delivery"  
        H \--\> J\[Cloudflare Global CDN\]  
        J \--\> K\[End User / Search Engine Bots\]  
    end  
      
    style A fill:\#0B0F19,stroke:\#00F0FF,stroke-width:2px,color:\#fff  
    style S fill:\#8A2BE2,stroke:\#fff,stroke-width:2px,color:\#fff  
    style G fill:\#f38020,stroke:\#fff,stroke-width:2px,color:\#fff  
    style J fill:\#f38020,stroke:\#fff,stroke-width:2px,color:\#fff

## **2\. Full Folder Structure**

/  
├── astro.config.mjs             \# Core configuration (Astro \+ Starlight)  
├── package.json  
├── tsconfig.json  
├── public/  
│   ├── robots.txt               \# Crawler directives  
│   ├── favicon.svg              \# TODO: Replace with official logo  
│   └── og-default.png           \# TODO: Replace with real default OG image  
├── src/  
│   ├── components/  
│   │   ├── SEO/  
│   │   │   ├── JsonLd.astro     \# Schema.org injector  
│   │   │   └── MetaTags.astro   \# OG and Twitter cards  
│   │   └── blocks/              \# UI Components mapping to Strapi Dynamic Zones  
│   │       ├── Hero.astro  
│   │       ├── CodeShowcase.astro  
│   │       └── FeatureGrid.astro  
│   ├── content/  
│   │   ├── config.ts            \# Zod schemas (Only for Starlight Docs now)  
│   │   └── docs/                \# Starlight MDX files (VibeBlocks)  
│   │       ├── index.mdx  
│   │       └── core-concepts/  
│   ├── layouts/  
│   │   └── BaseLayout.astro     \# Master layout injecting SEO & JSON-LD  
│   ├── lib/  
│   │   └── strapi.ts            \# Strapi API Fetching Utility  
│   └── pages/  
│       ├── index.astro          \# Root Landing Page (Fetches from Strapi)  
│       ├── vibeblocks/  
│       │   └── index.astro      \# VibeBlocks Landing (Fetches from Strapi)  
│       ├── blog/  
│       │   ├── index.astro      \# Blog listing (Fetches from Strapi)  
│       │   └── \[slug\].astro     \# Dynamic blog routing (getStaticPaths via Strapi)  
│       └── rss.xml.js           \# RSS Feed generator (Fetches from Strapi)

## **3\. Configuration Files**

### **astro.config.mjs (Astro & Starlight Integration)**

import { defineConfig } from 'astro/config';  
import starlight from '@astrojs/starlight';  
import tailwind from '@astrojs/tailwind';  
import sitemap from '@astrojs/sitemap';

const SITE\_URL \= '\[https://aadigitalbusiness.com\](https://aadigitalbusiness.com)';

export default defineConfig({  
  site: SITE\_URL,  
  output: 'static', // Still generating 100% static output  
  integrations: \[  
    tailwind(),  
    sitemap(),  
    starlight({  
      title: 'VibeBlocks',  
      customCss: \['./src/styles/starlight-custom.css'\],  
      logo: {  
        src: './src/assets/vibeblocks-logo.svg', // TODO: Add real logo  
      },  
      social: {  
        github: '\[https://github.com/AADigitalBusiness/vibeblocks\](https://github.com/AADigitalBusiness/vibeblocks)',  
      },  
      sidebar: \[  
        {  
          label: 'Getting Started',  
          items: \[  
            { label: 'Introduction', link: '/docs/' },  
            { label: 'Installation', link: '/docs/getting-started/installation/' },  
          \],  
        },  
        {  
          label: 'Core Concepts',  
          autogenerate: { directory: 'docs/core-concepts' },  
        },  
      \],  
      // Multilingual-ready architecture  
      locales: {  
        root: { label: 'English', lang: 'en' },  
      },  
    }),  
  \],  
});

### **src/content/config.ts (Zod Schemas)**

import { defineCollection } from 'astro:content';  
import { docsSchema } from '@astrojs/starlight/schema';

// Note: Blog collection removed. Blog data is now managed and typed via the Strapi API.  
export const collections \= {  
  docs: defineCollection({ schema: docsSchema() }), // Starlight default schema strictly for documentation  
};

## **4\. Advanced SEO & JSON-LD Implementation**

### **src/components/SEO/JsonLd.astro**

\---  
const { type, data } \= Astro.props;

// Base Organization Schema (Always injected)  
const organizationSchema \= {  
  "@context": "\[https://schema.org\](https://schema.org)",  
  "@type": "Organization",  
  "name": "AA Digital Business",  
  // TODO: Replace URL and Logo with real production data  
  "url": "\[https://aadigitalbusiness.com\](https://aadigitalbusiness.com)",  
  "logo": "\[https://aadigitalbusiness.com/logo.png\](https://aadigitalbusiness.com/logo.png)",  
  "description": "High-end technical architecture and AI-driven systems company."  
};

let schema \= organizationSchema;

// Article Schema injection for Blog (Data sourced from Strapi)  
if (type \=== 'Article') {  
  schema \= {  
    "@context": "\[https://schema.org\](https://schema.org)",  
    "@type": "TechArticle",  
    "headline": data.title,  
    "description": data.description,  
    "datePublished": data.publishedAt, // Strapi format  
    "author": {  
      "@type": "Person",  
      "name": data.author?.name || 'AA Digital Business Team'   
    },  
    "publisher": organizationSchema  
  };  
}

/\* TODO: Add schema generators for SoftwareSourceCode (VibeBlocks) and FAQPage \*/  
\---

\<script type="application/ld+json" set:html={JSON.stringify(schema)} /\>

### **src/pages/blog/\[slug\].astro (Hybrid SSG Fetching Example)**

\---  
import BaseLayout from '../../layouts/BaseLayout.astro';  
import fetchApi from '../../lib/strapi';

// Generating static paths at build time using Strapi Data  
export async function getStaticPaths() {  
  const articles \= await fetchApi({ endpoint: 'articles', query: { populate: '\*' } });  
    
  return articles.map((article) \=\> ({  
    params: { slug: article.attributes.slug },  
    props: { article: article.attributes },  
  }));  
}

const { article } \= Astro.props;  
\---

\<BaseLayout   
  title={article.title}   
  description={article.description}   
  isArticle={true}   
  articleData={article}  
\>  
  \<article class="prose dark:prose-invert"\>  
    \<h1\>{article.title}\</h1\>  
    \<\!-- Content rendered dynamically from Strapi \--\>  
    \<div set:html={article.content} /\>  
  \</article\>  
\</BaseLayout\>

## **5\. Feeds and Crawlers**

### **src/pages/rss.xml.js**

import rss from '@astrojs/rss';  
import fetchApi from '../lib/strapi';

export async function GET(context) {  
  // Fetch posts from Strapi CMS instead of local markdown  
  const articles \= await fetchApi({ endpoint: 'articles' });  
    
  return rss({  
    title: 'AA Digital Business | Engineering Insights',  
    description: 'Technical architecture, AI systems, and VibeBlocks updates.',  
    // TODO: Update context.site in production  
    site: context.site,  
    items: articles.map((post) \=\> ({  
      title: post.attributes.title,  
      pubDate: post.attributes.publishedAt,  
      description: post.attributes.description,  
      link: \`/blog/${post.attributes.slug}/\`,  
    })),  
    customData: \`\<language\>en-us\</language\>\`,  
  });  
}

### **public/robots.txt**

User-agent: \*  
Allow: /

\# Block AI crawlers from scraping proprietary architecture content if desired  
\# User-agent: GPTBot  
\# Disallow: /

\# TODO: Replace with real production sitemap URL  
Sitemap: \[https://aadigitalbusiness.com/sitemap-index.xml\](https://aadigitalbusiness.com/sitemap-index.xml)

## **6\. Content Examples (MDX \- Starlight Only)**

### **src/content/docs/index.mdx**

\---  
title: Introduction to VibeBlocks  
description: A Zero-Gravity Python framework for modular execution flows.  
template: splash  
hero:  
  title: Deterministic AI Orchestration  
  tagline: Engineered by AA Digital Business. Build modular, extensible, and resilient execution flows.  
  actions:  
    \- text: Get Started  
      link: /docs/getting-started/installation  
      icon: right-arrow  
      variant: primary  
    \- text: View on GitHub  
      link: \[https://github.com/AADigitalBusiness/vibeblocks\](https://github.com/AADigitalBusiness/vibeblocks)  
      icon: external  
\---

\#\# Why VibeBlocks?

VibeBlocks provides the deterministic "muscle" for AI "brains".

## **7\. Strategic Extension Plans**

### **17\. Content Governance (Hybrid Model)**

* **Marketing/Sales Content:** Governed entirely via Strapi Cloud. Non-technical teams can spin up landing pages and publish blog posts without git commits.  
* **Technical Documentation:** Governed purely via GitHub. Code changes to the VibeBlocks Python library trigger documentation updates via MDX pull requests. Starlight renders these perfectly alongside the Strapi-powered pages.

### **18\. Future Search Enhancement Strategy**

* **Strategy:** Integrate **Pagefind**. It is an entirely static search library designed specifically for SSGs like Astro. It builds a search index locally (indexing both the Starlight-generated pages AND the Astro pages generated via the Strapi API) and serves it as static chunks, requiring zero backend server at runtime.

### **Cloudflare Pages Deployment Configuration**

* **Build Command:** npm run build  
* **Build Output Directory:** dist  
* **Environment Variables:** Must include STRAPI\_URL and STRAPI\_API\_TOKEN in Cloudflare settings to allow SSG fetching.  
* **Webhook Strategy:** Configure a Strapi webhook to trigger a Cloudflare Pages redeployment whenever content is updated in the CMS.

## **8\. SEO & Performance Checklist**

* \[x\] Pre-render HTML (Static Output).  
* \[x\] Hybrid Data Sourcing (Strapi API at build time \+ Local MDX).  
* \[x\] Zero cumulative layout shift (CLS) by utilizing Tailwind's strict grid systems.  
* \[x\] Automated Sitemap via @astrojs/sitemap.  
* \[x\] JSON-LD Schema integration for semantic search context.  
* \[x\] \<link rel="alternate" hreflang="x-default" ... /\> ready for multilingual Starlight expansion.

*Engineered by AA Digital Business.*