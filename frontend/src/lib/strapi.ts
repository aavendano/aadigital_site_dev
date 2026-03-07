import type { Article, Category, HomePage, StrapiEntity, StrapiMedia, StrapiResponse } from './types';

let STRAPI_URL = import.meta.env.STRAPI_URL;
let STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN;

const DEFAULT_TIMEOUT_MS = 10000;
const DEBUG_MODE = import.meta.env.STRAPI_DEBUG === 'true';
const cache = new Map<string, Promise<unknown>>();

function flattenAttributes(data: any): any {
  if (!data) return null;
  if (Array.isArray(data)) return data.map(flattenAttributes);

  let flattened = { ...data };
  if (data.attributes) {
    flattened = {
      id: data.id,
      ...flattenAttributes(data.attributes),
    };
  }

  for (const key in flattened) {
    if (flattened[key] && typeof flattened[key] === 'object') {
      flattened[key] =
        flattened[key].data !== undefined
          ? flattenAttributes(flattened[key].data)
          : flattenAttributes(flattened[key]);
    }
  }

  return flattened;
}

const logDebug = (message: string, context?: Record<string, unknown>) => {
  if (!DEBUG_MODE) return;
  // eslint-disable-next-line no-console
  console.debug(`[StrapiClient] ${message}`, context ?? {});
};

const normalizeBaseUrl = (url: string): string => url.replace(/\/+$/, '');

const normalizeEndpoint = (endpoint: string): string => {
  if (!endpoint || endpoint.trim().length === 0) {
    throw new Error('Strapi endpoint is required');
  }

  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
};

export class StrapiClientError extends Error {
  constructor(
    message: string,
    public readonly details: { endpoint: string; url: string; status?: number; cause?: unknown }
  ) {
    super(message);
    this.name = 'StrapiClientError';
  }
}

export function validateConfig(): void {
  STRAPI_URL = import.meta.env.STRAPI_URL;
  STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN;

  if (!STRAPI_URL) throw new Error('STRAPI_URL environment variable is required');
  if (!STRAPI_TOKEN) throw new Error('STRAPI_API_TOKEN environment variable is required');

  try {
    new URL(STRAPI_URL);
  } catch {
    throw new Error('STRAPI_URL must be a valid URL');
  }
}

export function buildStrapiApiUrl(endpoint: string): string {
  validateConfig();
  return `${normalizeBaseUrl(STRAPI_URL)}/api${normalizeEndpoint(endpoint)}`;
}

export function clearStrapiCache(): void {
  cache.clear();
}

export function getStrapiMedia(media: StrapiMedia | null): string | null {
  if (!media?.url?.trim()) return null;

  if (media.url.startsWith('/')) {
    validateConfig();
    return `${normalizeBaseUrl(STRAPI_URL)}${media.url}`;
  }

  return media.url;
}

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const normalizedEndpoint = normalizeEndpoint(endpoint);
  const url = buildStrapiApiUrl(normalizedEndpoint);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    Authorization: `Bearer ${STRAPI_TOKEN}`,
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal ?? controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    const message = error instanceof Error && error.name === 'AbortError'
      ? `Strapi API request timed out after ${timeoutMs}ms`
      : `Failed to connect to Strapi API`;

    throw new StrapiClientError(`${message} (${normalizedEndpoint})`, {
      endpoint: normalizedEndpoint,
      url,
      cause: error,
    });
  }

  clearTimeout(timeoutId);
  logDebug('API response', { endpoint: normalizedEndpoint, status: response.status });

  if (!response.ok) {
    const baseMessage = `Strapi API request failed for ${normalizedEndpoint}`;
    if (response.status === 401) {
      throw new StrapiClientError(`${baseMessage}: invalid API token`, {
        endpoint: normalizedEndpoint,
        url,
        status: response.status,
      });
    }

    if (response.status === 403) {
      throw new StrapiClientError(`${baseMessage}: insufficient permissions`, {
        endpoint: normalizedEndpoint,
        url,
        status: response.status,
      });
    }

    if (response.status === 404) {
      throw new StrapiClientError(`${baseMessage}: content type not found`, {
        endpoint: normalizedEndpoint,
        url,
        status: response.status,
      });
    }

    throw new StrapiClientError(`${baseMessage}: ${response.status} ${response.statusText}`, {
      endpoint: normalizedEndpoint,
      url,
      status: response.status,
    });
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    throw new StrapiClientError(`Invalid JSON returned by Strapi for ${normalizedEndpoint}`, {
      endpoint: normalizedEndpoint,
      url,
      cause: error,
    });
  }
}

export async function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const existing = cache.get(key) as Promise<T> | undefined;
  if (existing) return existing;

  const pending = fetcher().catch((error) => {
    cache.delete(key);
    throw error;
  });

  cache.set(key, pending);
  return pending;
}

export async function fetchArticles(): Promise<Article[]> {
  return cachedFetch('articles', async () => {
    const params = new URLSearchParams({
      'populate[author][populate]': 'avatar',
      'populate[category]': '*',
      'populate[cover]': '*',
      sort: 'publishedAt:desc',
    });

    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>[]>>(`/articles?${params.toString()}`);
    return flattenAttributes(response.data) ?? [];
  });
}

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
    if (!response.data?.length) return null;
    return flattenAttributes(response.data[0]);
  });
}

export async function fetchArticleSlugs(): Promise<string[]> {
  return cachedFetch('article-slugs', async () => {
    const params = new URLSearchParams({
      'fields[0]': 'slug',
      'pagination[pageSize]': '100',
    });

    const response = await fetchAPI<StrapiResponse<StrapiEntity<{ slug: string }>[]>>(`/articles?${params.toString()}`);
    return response.data.map((item) => item.attributes.slug).filter(Boolean);
  });
}

export async function fetchCategories(): Promise<Category[]> {
  return cachedFetch('categories', async () => {
    const params = new URLSearchParams({
      'fields[0]': 'name',
      'fields[1]': 'slug',
      'fields[2]': 'description',
    });

    const response = await fetchAPI<StrapiResponse<StrapiEntity<any>[]>>(`/categories?${params.toString()}`);
    return flattenAttributes(response.data) ?? [];
  });
}

export async function fetchHomePage(): Promise<HomePage | null> {
  return cachedFetch('home-page', async () => {
    const params = new URLSearchParams({ populate: '*' });

    try {
      const response = await fetchAPI<StrapiResponse<StrapiEntity<any>>>(`/home-page?${params.toString()}`);
      return response.data ? flattenAttributes(response.data) : null;
    } catch (error) {
      if (error instanceof StrapiClientError && error.details.status === 404) {
        return null;
      }

      throw error;
    }
  });
}
