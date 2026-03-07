import { describe, expect, it } from 'vitest';
import { filterArticlesByCategory, formatPublishDate, getFeaturedArticles } from './content';

const article = (id: number, slug: string) => ({
  id,
  slug,
  title: `Article ${id}`,
  description: 'Description',
  cover: null,
  author: { id: 1, name: 'Author', email: 'a@a.com', avatar: null },
  category: { id, name: slug, slug, description: null },
  blocks: [],
  publishedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

describe('content helpers', () => {
  it('formats valid publish date', () => {
    expect(formatPublishDate('2026-02-02T00:00:00.000Z')).toContain('2026');
  });

  it('returns Unknown date for invalid date', () => {
    expect(formatPublishDate('oops')).toBe('Unknown date');
  });

  it('filters category and supports all', () => {
    const articles = [article(1, 'tech'), article(2, 'design')];
    expect(filterArticlesByCategory(articles as any, 'tech')).toHaveLength(1);
    expect(filterArticlesByCategory(articles as any, 'all')).toHaveLength(2);
  });

  it('limits featured article count to 3', () => {
    const articles = [article(1, 'a'), article(2, 'b'), article(3, 'c'), article(4, 'd')];
    expect(getFeaturedArticles(articles as any, 3)).toHaveLength(3);
  });
});
