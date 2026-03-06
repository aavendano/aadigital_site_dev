# Architecture & Technical Implementation

This project implements a Hybrid "Zero-Gravity" Web Architecture combining Strapi CMS with Astro static site generation.

## Core Architecture Principles

- **Static-First**: All pages are pre-rendered at build time (output: 'static')
- **Hybrid Data Sources**: Marketing content from Strapi API, technical docs from Git-based MDX
- **Edge Delivery**: Deployed to Cloudflare Pages with global CDN distribution
- **Zero Runtime**: No server-side rendering, pure static HTML/CSS/JS

## Technology Stack

- **Frontend Framework**: Astro (Static Site Generation)
- **Styling**: Tailwind CSS (utility-first, zero runtime)
- **CMS**: Strapi (Headless CMS for marketing/blog content)
- **Documentation**: Starlight (Git-based MDX in /src/content/docs)
- **Search**: Pagefind (static search, no backend)
- **Deployment**: Cloudflare Pages

## Data Fetching Strategy

- **Build Time Only**: All Strapi API calls happen during build via getStaticPaths()
- **No Client-Side Fetching**: Content is baked into static HTML
- **Webhook Triggers**: Strapi webhooks trigger Cloudflare Pages rebuilds on content updates
- **Environment Variables**: STRAPI_URL and STRAPI_API_TOKEN must be configured in Cloudflare

## File Structure Conventions

```
src/
├── components/
│   ├── SEO/              # JSON-LD and meta tag components
│   └── blocks/           # UI components mapping to Strapi Dynamic Zones
├── content/
│   └── docs/             # Starlight MDX files (technical documentation only)
├── layouts/
│   └── BaseLayout.astro  # Master layout with SEO & JSON-LD injection
├── lib/
│   └── strapi.ts         # Strapi API fetching utility
└── pages/
    ├── blog/             # Blog pages (data from Strapi)
    └── vibeblocks/       # Product pages (data from Strapi)
```

## SEO & Performance Requirements

- Pre-render all HTML at build time
- Inject JSON-LD structured data on every page
- Zero cumulative layout shift (CLS) using Tailwind grid systems
- Automated sitemap generation via @astrojs/sitemap
- RSS feed generation from Strapi content
- Multilingual-ready architecture (hreflang support)

## Content Governance Model

- **Marketing/Sales Content**: Managed in Strapi Cloud (non-technical teams)
- **Technical Documentation**: Managed in Git as MDX (engineering teams)
- **Blog Posts**: Managed in Strapi, rendered via Astro at build time
- **Static Pages**: Astro components with Strapi data injection

## Development Guidelines

- Use TypeScript for all scripts and strict typing
- Prefer Astro components (.astro) for UI logic
- Implement graceful error handling for Strapi API calls
- Never hardcode blog posts in markdown (use Strapi)
- Use semantic HTML5 for accessibility
- Maintain "Engineered by AA Digital Business" attribution

## Deployment Configuration

- **Build Command**: npm run build
- **Output Directory**: dist
- **Required Environment Variables**: STRAPI_URL, STRAPI_API_TOKEN
- **Webhook Strategy**: Configure Strapi to trigger Cloudflare Pages rebuilds

## Design System

- **Theme**: Clinical Light Mode (pure whites, subtle grays, 1px borders)
- **Code Blocks**: Dark theme (One Dark Pro or Dracula) for contrast
- **Language**: All user-facing content in English
- **Visuals**: Abstract data representations, no generic illustrations
- **Accessibility**: Strict semantic HTML5, perfect a11y scores

## Placeholder Policy

Never fabricate business information. Use semantic placeholders with TODO comments:
- URLs: https://example.com // TODO: Replace with production URL
- Structured data: /* TODO: Replace with actual company data */
- Social links, metrics, team info: Use placeholders, never invent
