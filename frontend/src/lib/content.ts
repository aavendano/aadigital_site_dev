import type { Article, Block } from './types';

export function formatPublishDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown date';
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export function filterArticlesByCategory(articles: Article[], categorySlug: string): Article[] {
  if (!categorySlug || categorySlug === 'all') {
    return articles;
  }

  return articles.filter((article) => article.category?.slug === categorySlug);
}

export function getFeaturedArticles(articles: Article[], limit = 3): Article[] {
  return articles.slice(0, Math.max(limit, 0));
}

export function getBlockType(block: Block): string {
  return block.__component;
}
