import type { 
  StrapiMedia, 
  Article, 
  Category,
  HomePage,
  StrapiResponse, 
  StrapiEntity 
} from './types';

// ... (previous constants and logDebug)

/**
 * Flattens Strapi v4 response structure (attributes/data) recursively.
 */
function flattenAttributes(data: any): any {
  if (!data) return null;

  if (Array.isArray(data)) {
    return data.map(flattenAttributes);
  }

  let flattened = { ...data };

  if (data.attributes) {
    flattened = {
      id: data.id,
      ...flattenAttributes(data.attributes),
    };
  }

  for (const key in flattened) {
    if (flattened[key] && typeof flattened[key] === 'object') {
      if (flattened[key].data !== undefined) {
        flattened[key] = flattenAttributes(flattened[key].data);
      } else {
        flattened[key] = flattenAttributes(flattened[key]);
      }
    }
  }

  return flattened;
}

/**
 * Fetch all published articles with basic relations.
 * Requirements: 2.1, 2.2, 2.3, 2.4, 3.2-3.6
 */
export async function fetchArticles(): Promise<Article[]> {
  return cachedFetch('articles', async () => {
    const params = new URLSearchParams({
      'populate[author][populate]': 'avatar',
      'populate[category]': '*',
      'populate[cover]': '*',
      'sort': 'publishedAt:desc',
    });
    
    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>[]>>(`/articles?${params.toString()}`);
    return flattenAttributes(response.data);
  });
}

/**
 * Fetch a single article by slug with full content (blocks).
 * Requirements: 4.4, 2.6
 */
export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  return cachedFetch(`article-${slug}`, async () => {
    const params = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate[author][populate]': 'avatar',
      'populate[category]': '*',
      'populate[cover]': '*',
      'populate[blocks]': '*',
    });
    
    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>[]>>(`/articles?${params.toString()}`);
    
    if (!response.data || response.data.length === 0) {
      return null;
    }
    
    return flattenAttributes(response.data[0]);
  });
}

/**
 * Fetch only the slugs for all articles.
 * Requirements: 4.3
 */
export async function fetchArticleSlugs(): Promise<string[]> {
  return cachedFetch('article-slugs', async () => {
    const params = new URLSearchParams({
      'fields[0]': 'slug',
      'pagination[pageSize]': '100', // Adjust as needed
    });
    
    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>[]>>(`/articles?${params.toString()}`);
    return response.data.map(item => item.attributes.slug);
  });
}

/**
 * Fetch all categories.
 * Requirements: 10.1
 */
export async function fetchCategories(): Promise<Category[]> {
  return cachedFetch('categories', async () => {
    const params = new URLSearchParams({
      'fields[0]': 'name',
      'fields[1]': 'slug',
      'fields[2]': 'description',
    });

    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>[]>>(`/categories?${params.toString()}`);
    return flattenAttributes(response.data);
  });
}

/**
 * Fetch the homepage single type content.
 * Requirements: 5.1, 5.2
 */
export async function fetchHomePage(): Promise<HomePage | null> {
  return cachedFetch('home-page', async () => {
    const params = new URLSearchParams({
      'populate': '*',
    });

    try {
      const response = await fetchAPI<StrapiResponse<StrapiEntity<any>>>(`/home-page?${params.toString()}`);
      if (!response.data) return null;
      return flattenAttributes(response.data);
    } catch (error) {
      // If homepage content type doesn't exist yet, return null gracefully
      if (error instanceof Error && error.message.includes('not found')) {
        return null;
      }
      throw error;
    }
  });
}

let STRAPI_URL = import.meta.env.STRAPI_URL;
let STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN;

const DEFAULT_TIMEOUT_MS = 10000;
const DEBUG_MODE = import.meta.env.STRAPI_DEBUG === 'true';

const cache = new Map<string, Promise<unknown>>();

const logDebug = (message: string, context?: Record<string, unknown>) => {
  if (!DEBUG_MODE) return;
  const timestamp = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.debug(`[StrapiClient][${timestamp}] ${message}`, context ?? {});
};

const normalizeBaseUrl = (url: string): string => url.replace(/\/+$/, '');

const normalizeEndpoint = (endpoint: string): string => {
  if (!endpoint || endpoint.trim().length === 0) {
    throw new Error('Strapi endpoint is required');
  }

  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
};

/**
 * Validates environment variables and throws descriptive errors if missing.
 */
export function validateConfig(): void {
  // Refresh from env in case tests stub values after module load.
  STRAPI_URL = import.meta.env.STRAPI_URL;
  STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN;

  if (!STRAPI_URL) {
    throw new Error('STRAPI_URL environment variable is required');
  }

  if (!STRAPI_TOKEN) {
    throw new Error('STRAPI_API_TOKEN environment variable is required');
  }

  try {
    new URL(STRAPI_URL);
  } catch {
    throw new Error('STRAPI_URL must be a valid URL');
  }
}

/**
 * Constructs the fully-qualified Strapi API URL for an endpoint.
 */
export function buildStrapiApiUrl(endpoint: string): string {
  validateConfig();
  return `${normalizeBaseUrl(STRAPI_URL)}/api${normalizeEndpoint(endpoint)}`;
}

/**
 * Clears in-memory API cache (useful for tests).
 */
export function clearStrapiCache(): void {
  cache.clear();
}

/**
 * Helper to construct full image URL from Strapi media object.
 */
export function getStrapiMedia(media: StrapiMedia | null): string | null {
  if (!media) return null;

  const mediaUrl = media.url?.trim();
  if (!mediaUrl) return null;

  if (mediaUrl.startsWith('/')) {
    validateConfig();
    return `${normalizeBaseUrl(STRAPI_URL)}${mediaUrl}`;
  }

  return mediaUrl;
}

/**
 * Core fetching function with authentication and error handling.
 */
export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const url = buildStrapiApiUrl(endpoint);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    Authorization: `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  logDebug('Sending request', {
    method: options.method ?? 'GET',
    url,
    timeoutMs,
  });

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal ?? controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Strapi API request timed out after ${timeoutMs}ms`);
    }

    const details = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to connect to Strapi at ${url}: ${details}`);
  } finally {
    clearTimeout(timeoutId);
  }

  logDebug('Received response', {
    url,
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid Strapi API token. Check STRAPI_API_TOKEN');
    }

    if (response.status === 403) {
      throw new Error('Strapi API token lacks required permissions');
    }

    if (response.status === 404) {
      throw new Error(`Strapi content type not found: ${normalizeEndpoint(endpoint)}`);
    }

    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON response from Strapi for ${url}: ${details}`);
  }
}

/**
 * Caching wrapper for API calls. Failed requests are not cached.
 */
export async function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cachedPromise = cache.get(key) as Promise<T> | undefined;
  if (cachedPromise) {
    return cachedPromise;
  }

  const pendingPromise = fetcher().catch((error) => {
    cache.delete(key);
    throw error;
  });

  cache.set(key, pendingPromise);
  return pendingPromise;
}
