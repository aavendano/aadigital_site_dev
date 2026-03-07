export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  slug: string;
  cover: StrapiMedia | null;
  author: Author;
  category: Category;
  blocks: Block[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: number;
  name: string;
  email: string;
  avatar: StrapiMedia | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface StrapiMedia {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
  url: string;
}

export interface MediaFormat {
  url: string;
  width: number;
  height: number;
  size: number;
}

export type Block = RichTextBlock | MediaBlock | QuoteBlock | SliderBlock;

export interface RichTextBlock {
  __component: 'shared.rich-text';
  id: number;
  body: string;
}

export interface MediaBlock {
  __component: 'shared.media';
  id: number;
  file: StrapiMedia;
}

export interface QuoteBlock {
  __component: 'shared.quote';
  id: number;
  title: string;
  body: string;
}

export interface SliderBlock {
  __component: 'shared.slider';
  id: number;
  files: StrapiMedia[];
}

export interface HomePage {
  id: number;
  title: string;
  description: string;
  hero: {
    title: string;
    description: string;
  };
}
