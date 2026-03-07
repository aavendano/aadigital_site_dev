---
title: Project Structure
---

## Monorepo Organization

```
/
├── backend/          # Strapi Headless CMS
├── frontend/         # Astro + Starlight static site
├── .agents/          # AI agent documentation and rules
└── .kiro/            # Kiro IDE configuration
```

## Backend Structure (`/backend`)

```
backend/
├── config/           # Strapi configuration
│   ├── database.js   # Database connection (SQLite/MySQL/PostgreSQL)
│   ├── server.js     # Server settings (host, port, webhooks)
│   ├── admin.js      # Admin panel config
│   ├── api.js        # API settings
│   ├── middlewares.js
│   └── plugins.js
├── src/
│   ├── api/          # Content types and API endpoints
│   │   ├── article/  # Blog articles (title, slug, description, blocks)
│   │   ├── author/   # Article authors (name, email, avatar)
│   │   ├── category/ # Article categories
│   │   ├── global/   # Global site settings
│   │   ├── home-page/# Homepage content
│   │   └── about/    # About page content
│   ├── components/   # Reusable Strapi components
│   │   └── shared/   # Shared components (media, quote, rich-text, seo, slider)
│   ├── bootstrap.js  # Bootstrap logic
│   └── index.js      # Entry point
├── data/             # Seed data and uploads
├── database/         # Database files and migrations
├── public/           # Public assets
└── scripts/          # Utility scripts (seed.js)
```

## Frontend Structure (`/frontend`)

```
frontend/
├── src/
│   ├── pages/        # Route definitions
│   │   ├── index.astro           # Homepage (fetches from Strapi)
│   │   ├── blog.astro            # Blog listing (fetches from Strapi)
│   │   ├── blog/[slug].astro     # Dynamic blog posts (SSG via Strapi)
│   │   └── docs.astro            # Documentation entry
│   ├── content/      # Git-based content
│   │   ├── config.ts # Zod schemas for Starlight docs
│   │   └── docs/     # MDX documentation files (VibeBlocks)
│   ├── layouts/      # Page layouts
│   │   └── BaseLayout.astro      # Master layout with SEO/JSON-LD
│   ├── components/   # Reusable UI components
│   │   ├── SEO/      # SEO components (JsonLd.astro, MetaTags.astro)
│   │   └── blocks/   # UI blocks mapping to Strapi dynamic zones
│   ├── lib/          # Utilities
│   │   └── strapi.ts # Strapi API fetching utility
│   └── styles/       # Global styles
│       └── global.css
├── public/           # Static assets (robots.txt, favicon, OG images)
├── dist/             # Build output (generated, not in git)
├── astro.config.mjs  # Astro configuration
├── tailwind.config.mjs
└── tsconfig.json
```

## Key Conventions

### Content Types (Strapi)
- Each API folder contains: `content-types/`, `controllers/`, `services/`, `routes/`
- Schemas define structure in `schema.json`
- Dynamic zones use components from `src/components/shared/`

### Pages (Astro)
- Static pages: `.astro` files in `src/pages/`
- Dynamic routes: `[param].astro` with `getStaticPaths()` function
- Data fetching: Import from `lib/strapi.ts`, fetch at build time only

### Documentation (Starlight)
- All docs are MDX files in `src/content/docs/`
- Frontmatter defines title, description, template
- Sidebar auto-generated from folder structure

### Components
- Use `.astro` for UI components
- Use `.ts` for utilities and type definitions
- Strapi components are JSON schemas in `backend/src/components/`

## Configuration Files

- `package.json` (root): Workspace definitions
- `backend/.env.example`: Environment variable template
- `frontend/astro.config.mjs`: Astro + integrations config
- `backend/config/*.js`: Strapi configuration modules
