import fc from 'fast-check';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { 
  buildStrapiApiUrl, 
  cachedFetch, 
  clearStrapiCache, 
  getStrapiMedia,
  fetchArticles
} from './strapi';

describe('Feature: astro-strapi-integration', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv('STRAPI_URL', 'http://localhost:1337/');
    vi.stubEnv('STRAPI_API_TOKEN', 'valid_token');
    clearStrapiCache();
  });

  it('Property 1: URL Construction Correctness', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (rawEndpoint) => {
        const endpoint = rawEndpoint.replace(/\s+/g, 'a').trim();
        if (endpoint.length === 0) return;

        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const expected = `http://localhost:1337/api${normalizedEndpoint}`;

        expect(buildStrapiApiUrl(endpoint)).toBe(expected);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 13: API Response Caching', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }),
        fc.anything(),
        async (keyRaw, value) => {
          const key = keyRaw.trim() || 'fallback-key';
          const fetcher = vi.fn().mockResolvedValue(value);

          const first = await cachedFetch(key, fetcher);
          const second = await cachedFetch(key, fetcher);

          expect(first).toEqual(value);
          expect(second).toEqual(value);
          expect(fetcher).toHaveBeenCalledTimes(1);

          clearStrapiCache();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 6: Image URL Construction', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 80 }),
        fc.string({ minLength: 1, maxLength: 80 }),
        (relativePathRaw, absoluteUrlRaw) => {
          const cleanRelative = `/${relativePathRaw.replace(/\s+/g, '-').replace(/^\/+/, '')}`;
          const cleanAbsolute = `https://cdn.example.com/${absoluteUrlRaw
            .replace(/\s+/g, '-')
            .replace(/^\/+/, '')}`;

          expect(getStrapiMedia({ url: cleanRelative } as any)).toBe(
            `http://localhost:1337${cleanRelative}`
          );
          expect(getStrapiMedia({ url: cleanAbsolute } as any)).toBe(cleanAbsolute);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7: Image Format Support', () => {
    const formatArbitrary = fc.record({
      thumbnail: fc.option(fc.string({ minLength: 1, maxLength: 40 }), { nil: undefined }),
      small: fc.option(fc.string({ minLength: 1, maxLength: 40 }), { nil: undefined }),
      medium: fc.option(fc.string({ minLength: 1, maxLength: 40 }), { nil: undefined }),
      large: fc.option(fc.string({ minLength: 1, maxLength: 40 }), { nil: undefined }),
    });

    fc.assert(
      fc.property(formatArbitrary, (formats) => {
        const entries = Object.entries(formats).filter(([, value]) => !!value) as Array<
          [string, string]
        >;

        for (const [, value] of entries) {
          const relative = `/${value.replace(/\s+/g, '-').replace(/^\/+/, '')}.webp`;
          const absolute = `https://img.example.com/${value.replace(/\s+/g, '-')}.svg`;

          expect(getStrapiMedia({ url: relative } as any)).toBe(`http://localhost:1337${relative}`);
          expect(getStrapiMedia({ url: absolute } as any)).toBe(absolute);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: Article Sorting Order', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.record({
          id: fc.integer(),
          attributes: fc.record({
            title: fc.string(),
            publishedAt: fc.date().map(d => d.toISOString())
          })
        }), { minLength: 2 }),
        async (mockData) => {
          vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({ data: mockData })
          }));

          await fetchArticles();
          
          const fetchMock = vi.mocked(fetch);
          const [url] = fetchMock.mock.calls[0] as [string];
          expect(url).toContain('sort=publishedAt%3Adesc');
          
          clearStrapiCache();
        }
      ),
      { numRuns: 10 }
    );
  });
});
