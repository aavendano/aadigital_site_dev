import fc from 'fast-check';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildStrapiApiUrl, cachedFetch, clearStrapiCache, getStrapiMedia } from './strapi';
import { filterArticlesByCategory, getFeaturedArticles } from './content';
import { articleArbitrary } from './test-utils';

describe('astro-strapi integration property tests', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv('STRAPI_URL', 'http://localhost:1337/');
    vi.stubEnv('STRAPI_API_TOKEN', 'valid_token');
    clearStrapiCache();
  });

  it('Property: API URL construction always normalizes endpoints', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 40 }), (rawEndpoint) => {
        const endpoint = rawEndpoint.replace(/\s+/g, 'a');
        const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        expect(buildStrapiApiUrl(endpoint)).toBe(`http://localhost:1337/api${normalized}`);
      })
    );
  });

  it('Property: cache returns same value and calls fetcher once', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string({ minLength: 1 }), fc.anything(), async (keyRaw, value) => {
        const key = keyRaw.trim() || 'key';
        const fetcher = vi.fn().mockResolvedValue(value);
        const first = await cachedFetch(key, fetcher);
        const second = await cachedFetch(key, fetcher);
        expect(first).toEqual(second);
        expect(fetcher).toHaveBeenCalledTimes(1);
        clearStrapiCache();
      })
    );
  });

  it('Property: media URL supports relative and absolute URLs', () => {
    fc.assert(
      fc.property(fc.webUrl(), fc.string({ minLength: 1, maxLength: 30 }), (abs, rel) => {
        const relative = `/uploads/${rel.replace(/\s+/g, '-')}.png`;
        expect(getStrapiMedia({ url: relative } as any)).toBe(`http://localhost:1337${relative}`);
        expect(getStrapiMedia({ url: abs } as any)).toBe(abs);
      })
    );
  });

  it('Property: category filtering only returns matching slugs', () => {
    fc.assert(
      fc.property(fc.array(articleArbitrary, { minLength: 1, maxLength: 12 }), (articles) => {
        const pickedSlug = articles[0].category.slug;
        const filtered = filterArticlesByCategory(articles as any, pickedSlug);
        expect(filtered.every((article) => article.category.slug === pickedSlug)).toBe(true);
      })
    );
  });

  it('Property: featured article helper never exceeds limit', () => {
    fc.assert(
      fc.property(fc.array(articleArbitrary, { maxLength: 20 }), fc.integer({ min: 0, max: 10 }), (articles, limit) => {
        const featured = getFeaturedArticles(articles as any, limit);
        expect(featured.length).toBeLessThanOrEqual(limit);
      })
    );
  });
});
