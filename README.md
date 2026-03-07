# AA Digital Business - Astro + Strapi Integration

This repository contains:

- `backend/`: Strapi CMS
- `frontend/`: Astro static site

## Environment Variables

Create `frontend/.env`:

```bash
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token
STRAPI_DEBUG=false
```

## Local Development

### 1) Start Strapi backend

```bash
cd backend
npm install
npm run develop
```

### 2) Start Astro frontend

```bash
cd frontend
npm install
npm run dev
```

## Build Process

Astro fetches content from Strapi at build time (SSG):

```bash
cd frontend
npm run build
```

Generated static output is placed in `frontend/dist`.

## Testing

```bash
cd frontend
npm test
```

Property-based tests use `fast-check` and unit tests run with `vitest`.

## Strapi Content Requirements

The frontend expects these Strapi content types:

- `article` with relations: `author`, `category`, `cover`, `blocks`
- `category`
- `author`
- `home-page`

Expected dynamic zone blocks for article body:

- `shared.rich-text`
- `shared.media`
- `shared.quote`
- `shared.slider`

## Deployment Notes

1. Configure `STRAPI_URL` and `STRAPI_API_TOKEN` in deployment environment.
2. Trigger frontend rebuild whenever Strapi content updates.
3. Deploy `frontend/dist` to static hosting (e.g. Cloudflare Pages, Netlify, Vercel static output).
