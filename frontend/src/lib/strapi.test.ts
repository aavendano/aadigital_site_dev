import { beforeEach, describe, expect, it, vi } from 'vitest';
import { 
  validateConfig, 
  getStrapiMedia, 
  fetchAPI, 
  cachedFetch, 
  clearStrapiCache,
  buildStrapiApiUrl,
  fetchArticles,
  fetchArticleBySlug,
  fetchArticleSlugs,
  fetchCategories,
  fetchHomePage
} from './strapi';

describe('Strapi Config and Helpers', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv('STRAPI_URL', 'http://localhost:1337/');
    vi.stubEnv('STRAPI_API_TOKEN', 'valid_token');
    clearStrapiCache();
  });

  it('throws error when STRAPI_URL is missing', () => {
    vi.stubEnv('STRAPI_URL', '');
    expect(() => validateConfig()).toThrow('STRAPI_URL environment variable is required');
  });

  it('throws error when STRAPI_URL is invalid', () => {
    vi.stubEnv('STRAPI_URL', 'not-a-url');
    expect(() => validateConfig()).toThrow('STRAPI_URL must be a valid URL');
  });

  it('getStrapiMedia - handles relative URLs', () => {
    const media = { url: '/uploads/image.png' } as any;
    expect(getStrapiMedia(media)).toBe('http://localhost:1337/uploads/image.png');
  });

  it('buildStrapiApiUrl - constructs correct URL', () => {
    expect(buildStrapiApiUrl('test')).toBe('http://localhost:1337/api/test');
  });
});

describe('Article Fetching Functions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv('STRAPI_URL', 'http://localhost:1337');
    vi.stubEnv('STRAPI_API_TOKEN', 'secret_token');
    clearStrapiCache();
  });

  it('fetchArticles - fetches and flattens articles', async () => {
    const mockResponse = {
      data: [
        {
          id: 1,
          attributes: {
            title: 'Test Article',
            slug: 'test-article',
            author: {
              data: {
                id: 1,
                attributes: { name: 'Author Name' }
              }
            }
          }
        }
      ]
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse)
    }));

    const articles = await fetchArticles();
    expect(articles).toHaveLength(1);
    expect(articles[0]).toEqual({
      id: 1,
      title: 'Test Article',
      slug: 'test-article',
      author: { id: 1, name: 'Author Name' }
    });
  });

  it('fetchArticleBySlug - fetches single article and flattens', async () => {
    const mockResponse = {
      data: [
        {
          id: 1,
          attributes: {
            title: 'Test Article',
            slug: 'test-article'
          }
        }
      ]
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse)
    }));

    const article = await fetchArticleBySlug('test-article');
    expect(article).toEqual({
      id: 1,
      title: 'Test Article',
      slug: 'test-article'
    });
  });

  it('fetchArticleSlugs - returns array of strings', async () => {
    const mockResponse = {
      data: [
        { attributes: { slug: 'slug-1' } },
        { attributes: { slug: 'slug-2' } }
      ]
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse)
    }));

    const slugs = await fetchArticleSlugs();
    expect(slugs).toEqual(['slug-1', 'slug-2']);
  });
});

describe('fetchAPI', () => {
  beforeEach(() => {
    vi.stubEnv('STRAPI_URL', 'http://localhost:1337');
    vi.stubEnv('STRAPI_API_TOKEN', 'secret_token');
  });

  it('sends authenticated request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: {} }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await fetchAPI('/test');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/test'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer secret_token'
        })
      })
    );
  });
});

describe('Category and Homepage Fetching', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv('STRAPI_URL', 'http://localhost:1337');
    vi.stubEnv('STRAPI_API_TOKEN', 'secret_token');
    clearStrapiCache();
  });

  it('fetchCategories - fetches and flattens categories', async () => {
    const mockResponse = {
      data: [
        {
          id: 1,
          attributes: { name: 'Tech', slug: 'tech', description: 'Technology posts' }
        },
        {
          id: 2,
          attributes: { name: 'Design', slug: 'design', description: null }
        }
      ],
      meta: {}
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse)
    }));

    const categories = await fetchCategories();
    expect(categories).toHaveLength(2);
    expect(categories[0]).toEqual({ id: 1, name: 'Tech', slug: 'tech', description: 'Technology posts' });
    expect(categories[1]).toEqual({ id: 2, name: 'Design', slug: 'design', description: null });
  });

  it('fetchCategories - returns empty array when no categories', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: [], meta: {} })
    }));

    const categories = await fetchCategories();
    expect(categories).toEqual([]);
  });

  it('fetchCategories - requests only necessary fields', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: [], meta: {} })
    });
    vi.stubGlobal('fetch', fetchMock);

    await fetchCategories();
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toContain('/api/categories');
    expect(url).toContain('fields');
  });

  it('fetchHomePage - fetches and flattens homepage content', async () => {
    const mockResponse = {
      data: {
        id: 1,
        attributes: {
          title: 'Welcome',
          description: 'Homepage description',
          hero: { title: 'Hero Title', description: 'Hero Description' }
        }
      },
      meta: {}
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse)
    }));

    const homePage = await fetchHomePage();
    expect(homePage).toEqual({
      id: 1,
      title: 'Welcome',
      description: 'Homepage description',
      hero: { title: 'Hero Title', description: 'Hero Description' }
    });
  });

  it('fetchHomePage - returns null when data is missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: null, meta: {} })
    }));

    const homePage = await fetchHomePage();
    expect(homePage).toBeNull();
  });

  it('fetchHomePage - returns null when 404 not found', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    }));

    const homePage = await fetchHomePage();
    expect(homePage).toBeNull();
  });

  it('fetchCategories - caches results on repeated calls', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: [], meta: {} })
    });
    vi.stubGlobal('fetch', fetchMock);

    await fetchCategories();
    await fetchCategories();
    // Second call should use cache - fetch should only have been called once
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
