---
title: Technology Stack
---

## Architecture

Monorepo workspace with two main applications: backend (Strapi CMS) and frontend (Astro static site).

## Backend Stack

- **CMS**: Strapi v5.34.0 (Headless CMS)
- **Database**: SQLite (default), supports MySQL and PostgreSQL
- **Runtime**: Node.js 18-22
- **Dependencies**: React 18, React Router v6, Styled Components v6

## Frontend Stack

- **Framework**: Astro v5.2.0 (Static Site Generator)
- **Documentation**: Starlight v0.31.0 (Git-based MDX)
- **Styling**: Tailwind CSS v6.0.0 (utility-first, zero runtime)
- **SEO**: Sitemap generation via @astrojs/sitemap
- **Search**: Pagefind (static search, no backend)
- **Output**: 100% static HTML/CSS/JS

## Design System

- **Theme**: Clinical Light Mode (white backgrounds, cloud grays, 1px borders)
- **Code Blocks**: Dark theme for contrast (One Dark Pro or Dracula)
- **Typography**: Inter/Geist Sans for UI, JetBrains Mono for code
- **Colors**: #FFFFFF (bg), #F3F4F6 (secondary), #00FF41 (accent), #111827 (text)

## Common Commands

### Backend (Strapi)
```bash
cd backend
npm run develop      # Start with hot reload (port 1337)
npm run start        # Production mode
npm run build        # Build admin panel
npm run seed:example # Seed database with example data
```

### Frontend (Astro)
```bash
cd frontend
npm run dev          # Development server
npm run build        # Build static site to dist/
npm run preview      # Preview production build
```

### Root (Monorepo)
```bash
npm install          # Install all workspace dependencies
```

## Deployment

- **Platform**: Cloudflare Pages
- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`
- **Environment Variables**: `STRAPI_URL`, `STRAPI_API_TOKEN`
- **Trigger**: Git push to main + Strapi webhook on content updates

## Content Strategy

- **Dynamic Content**: Fetched from Strapi API at build time (SSG)
- **Static Docs**: MDX files in `frontend/src/content/docs/`
- **No Runtime API Calls**: All data baked into static HTML during build
