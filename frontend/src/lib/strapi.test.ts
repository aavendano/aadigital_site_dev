import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  StrapiClientError,
  buildStrapiApiUrl,
  cachedFetch,
  clearStrapiCache,
  fetchAPI,
  fetchHomePage,
  getStrapiMedia,
  validateConfig,
} from './strapi';

describe('strapi config and helpers', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv('STRAPI_URL', 'http://localhost:1337/');
    vi.stubEnv('STRAPI_API_TOKEN', 'token');
    clearStrapiCache();
  });

  it('throws when STRAPI_URL is missing', () => {
    vi.stubEnv('STRAPI_URL', '');
    expect(() => validateConfig()).toThrow('STRAPI_URL environment variable is required');
  });

  it('builds API URL correctly', () => {
    expect(buildStrapiApiUrl('articles')).toBe('http://localhost:1337/api/articles');
  });

  it('constructs relative media URL', () => {
    expect(getStrapiMedia({ url: '/uploads/demo.png' } as any)).toBe('http://localhost:1337/uploads/demo.png');
  });

  it('returns absolute media URL as-is', () => {
    expect(getStrapiMedia({ url: 'https://cdn.example.com/demo.png' } as any)).toBe('https://cdn.example.com/demo.png');
  });
});

describe('fetchAPI error handling', () => {
  beforeEach(() => {
    vi.stubEnv('STRAPI_URL', 'http://localhost:1337');
    vi.stubEnv('STRAPI_API_TOKEN', 'token');
    clearStrapiCache();
  });

  it('throws context-aware 401 error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401, statusText: 'Unauthorized' }));

    await expect(fetchAPI('/articles')).rejects.toMatchObject({
      name: 'StrapiClientError',
      details: expect.objectContaining({ status: 401 }),
    });
  });

  it('throws on invalid JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: vi.fn().mockRejectedValue(new Error('bad json')) })
    );

    await expect(fetchAPI('/articles')).rejects.toBeInstanceOf(StrapiClientError);
  });

  it('does not cache failed fetches', async () => {
    const fetcher = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('success');

    await expect(cachedFetch('k', fetcher)).rejects.toThrow('fail');
    await expect(cachedFetch('k', fetcher)).resolves.toBe('success');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('returns null for missing homepage content type', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' }));
    await expect(fetchHomePage()).resolves.toBeNull();
  });
});
