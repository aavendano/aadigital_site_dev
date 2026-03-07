import fc from 'fast-check';

export const mediaArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  name: fc.string({ minLength: 1, maxLength: 40 }),
  alternativeText: fc.option(fc.string({ maxLength: 60 }), { nil: null }),
  caption: fc.option(fc.string({ maxLength: 80 }), { nil: null }),
  width: fc.integer({ min: 100, max: 2000 }),
  height: fc.integer({ min: 100, max: 2000 }),
  formats: fc.record({}, { requiredKeys: [] }),
  url: fc.oneof(
    fc.string({ minLength: 3, maxLength: 40 }).map((v) => `/uploads/${v.replace(/\s+/g, '-')}.jpg`),
    fc.webUrl()
  ),
});

export const categoryArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  name: fc.string({ minLength: 1, maxLength: 30 }),
  slug: fc.string({ minLength: 1, maxLength: 30 }).map((v) => v.replace(/\s+/g, '-').toLowerCase()),
  description: fc.option(fc.string({ maxLength: 80 }), { nil: null }),
});

export const articleArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  title: fc.string({ minLength: 3, maxLength: 80 }),
  description: fc.string({ minLength: 3, maxLength: 200 }),
  slug: fc.string({ minLength: 3, maxLength: 50 }).map((v) => v.replace(/\s+/g, '-').toLowerCase()),
  cover: fc.option(mediaArbitrary, { nil: null }),
  author: fc.record({
    id: fc.integer({ min: 1 }),
    name: fc.string({ minLength: 1, maxLength: 30 }),
    email: fc.emailAddress(),
    avatar: fc.option(mediaArbitrary, { nil: null }),
  }),
  category: categoryArbitrary,
  blocks: fc.constant([]),
  publishedAt: fc.date().map((d) => d.toISOString()),
  createdAt: fc.date().map((d) => d.toISOString()),
  updatedAt: fc.date().map((d) => d.toISOString()),
});
