# Implementation Plan: Astro-Strapi Integration

## Overview

This implementation plan breaks down the Astro-Strapi integration into discrete, incremental tasks. Each task builds on previous work, with testing integrated throughout to catch issues early. The plan follows the Zero-Gravity architecture principle: all content fetched at build time, no runtime API calls.

## Tasks

- [x] 1. Set up environment configuration and TypeScript types
  - Create `.env.example` file with STRAPI_URL and STRAPI_API_TOKEN placeholders
  - Create `frontend/src/lib/types.ts` with all TypeScript interfaces (StrapiResponse, StrapiEntity, Article, Author, Category, StrapiMedia, Block types, HomePage)
  - Add environment variable validation in a config module
  - _Requirements: 1.1, 1.2, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 1.1 Write unit tests for environment validation
  - Test missing STRAPI_URL throws descriptive error
  - Test missing STRAPI_API_TOKEN throws descriptive error
  - _Requirements: 1.3, 1.4_

- [x] 2. Implement core API client module
  - [x] 2.1 Create `frontend/src/lib/strapi.ts` with base fetch function
    - Implement `fetchAPI()` with authentication headers
    - Add error handling for HTTP status codes (401, 403, 404, 500)
    - Implement request/response logging for debugging
    - _Requirements: 1.5, 7.1, 7.2, 7.3, 7.4_

  - [x] 2.2 Write property test for URL construction
    - **Property 1: URL Construction Correctness**
    - **Validates: Requirements 1.5**

  - [x] 2.3 Write unit tests for error handling
    - Test 401 error throws authentication error
    - Test 404 error throws resource not found error
    - Test network failure throws connection error
    - Test malformed JSON throws parse error
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 2.4 Implement caching mechanism
    - Create in-memory cache Map
    - Implement `cachedFetch()` wrapper function
    - Add cache key generation logic
    - _Requirements: 9.1, 9.4_

  - [x] 2.5 Write property test for caching behavior
    - **Property 13: API Response Caching**
    - **Validates: Requirements 9.1, 9.4**

- [x] 3. Implement image URL helper
  - [x] 3.1 Create `getStrapiMedia()` function
    - Handle null media objects
    - Detect relative vs absolute URLs
    - Prepend STRAPI_URL for relative paths
    - Return absolute URLs unchanged
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 3.2 Write property test for image URL construction
    - **Property 6: Image URL Construction**
    - **Validates: Requirements 6.1, 6.2**

  - [x] 3.3 Write property test for image format support
    - **Property 7: Image Format Support**
    - **Validates: Requirements 6.3, 6.4**

  - [x] 3.4 Write unit tests for edge cases
    - Test null media returns null
    - Test various image formats (jpg, png, webp, svg)
    - Test media with multiple format variants
    - _Requirements: 6.3, 6.4_

- [x] 4. Implement article fetching functions
  - [x] 4.1 Create `fetchArticles()` function
    - Construct API endpoint with populate parameters for author, category, and cover
    - Add sort parameter for publishedAt descending
    - Transform Strapi response format to flat Article objects
    - Implement parallel fetching for relations
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 9.2, 9.3_

  - [x] 4.2 Write property test for article relations
    - **Property 2: Article Relations Population**
    - **Validates: Requirements 2.2, 2.3**

  - [x] 4.3 Write property test for article sorting
    - **Property 3: Article Sorting Order**
    - **Validates: Requirements 2.4**

  - [x] 4.4 Write property test for article blocks
    - **Property 4: Article Blocks Presence**
    - **Validates: Requirements 2.6**

  - [x] 4.5 Write property test for parallel requests
    - **Property 14: Parallel Request Execution**
    - **Validates: Requirements 9.2**

  - [x] 4.6 Create `fetchArticleBySlug()` function
    - Construct API endpoint with slug filter
    - Populate all relations and blocks
    - Return null if article not found
    - _Requirements: 4.4_

  - [x] 4.7 Write property test for article page data completeness
    - **Property 9: Article Page Data Completeness**
    - **Validates: Requirements 4.4**

  - [x] 4.8 Create `fetchArticleSlugs()` function
    - Fetch only slug field for all published articles
    - Return array of slug strings
    - _Requirements: 4.3_

- [x] 5. Checkpoint - Ensure API client tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement category and homepage fetching
  - [x] 6.1 Create `fetchCategories()` function
    - Fetch all categories with basic fields
    - Transform to flat Category objects
    - _Requirements: 10.1_

  - [x] 6.2 Create `fetchHomePage()` function
    - Fetch single home-page content type
    - Transform to flat HomePage object
    - _Requirements: 5.1_

  - [x] 6.3 Write unit tests for category and homepage fetching
    - Test categories fetch returns array
    - Test homepage fetch returns object
    - Test empty results handling
    - _Requirements: 5.1, 10.1_

- [x] 7. Update blog listing page
  - [ ] 7.1 Replace hardcoded data in `frontend/src/pages/blog.astro`
    - Import `fetchArticles()` and `fetchCategories()`
    - Call functions in frontmatter
    - Pass data to template
    - Update article card rendering to use Strapi data
    - Implement empty state for no articles
    - _Requirements: 2.1, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 7.5_

  - [ ] 7.2 Write property test for article card rendering
    - **Property 5: Article Card Field Rendering**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5, 3.6**

  - [ ] 7.3 Write unit tests for blog listing page
    - Test article cards render with complete data
    - Test article cards render with missing cover image
    - Test empty articles array shows message
    - _Requirements: 3.7, 3.8, 7.5_

- [ ] 8. Implement category filtering
  - [ ] 8.1 Add Alpine.js or vanilla JS for client-side filtering
    - Install Alpine.js if not present (or use vanilla JS)
    - Add data attributes to article cards for category
    - Implement filter button click handlers
    - Show/hide articles based on selected category
    - Add active state styling to filter buttons
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ] 8.2 Write property test for category filter rendering
    - **Property 15: Category Filter Rendering**
    - **Validates: Requirements 10.1**

  - [ ] 8.3 Write property test for category filter functionality
    - **Property 16: Category Filter Functionality**
    - **Validates: Requirements 10.2**

  - [ ] 8.4 Write property test for active filter indication
    - **Property 17: Active Filter Indication**
    - **Validates: Requirements 10.5**

  - [ ] 8.5 Write unit tests for category filtering
    - Test "All" button shows all articles
    - Test category button shows only matching articles
    - Test empty category still shows button
    - Test active filter has distinct styling
    - _Requirements: 10.3, 10.4, 10.5_

- [ ] 9. Create dynamic article pages
  - [ ] 9.1 Create `frontend/src/pages/blog/[slug].astro`
    - Implement `getStaticPaths()` using `fetchArticleSlugs()`
    - Fetch article data for each slug using `fetchArticleBySlug()`
    - Return paths array with article data as props
    - Create article page layout with hero section
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 9.2 Write property test for static page generation
    - **Property 8: Static Page Generation**
    - **Validates: Requirements 4.1, 4.2**

  - [ ] 9.3 Write unit tests for dynamic article pages
    - Test getStaticPaths returns correct paths
    - Test article page renders with valid slug
    - Test 404 handling for invalid slug
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 10. Create block components
  - [ ] 10.1 Create `frontend/src/components/blocks/RichTextBlock.astro`
    - Accept block data as props
    - Render rich text content with proper HTML
    - Apply appropriate styling
    - _Requirements: 4.6_

  - [ ] 10.2 Create `frontend/src/components/blocks/MediaBlock.astro`
    - Accept block data as props
    - Use `getStrapiMedia()` for URL construction
    - Render image with alt text and dimensions
    - _Requirements: 4.7_

  - [ ] 10.3 Create `frontend/src/components/blocks/QuoteBlock.astro`
    - Accept block data as props
    - Render quote with title and body
    - Apply quote styling
    - _Requirements: 4.8_

  - [ ] 10.4 Create `frontend/src/components/blocks/SliderBlock.astro`
    - Accept block data as props
    - Render slider with multiple images
    - Use `getStrapiMedia()` for each image URL
    - _Requirements: 4.9_

  - [ ] 10.5 Write unit tests for block components
    - Test each block type renders correctly
    - Test media block constructs URLs properly
    - Test blocks handle missing data gracefully
    - _Requirements: 4.6, 4.7, 4.8, 4.9_

- [ ] 11. Implement block rendering in article pages
  - [ ] 11.1 Add block component mapping in `[slug].astro`
    - Import all block components
    - Create component map object
    - Iterate over article blocks
    - Render each block with corresponding component
    - _Requirements: 4.5_

  - [ ] 11.2 Write property test for block component mapping
    - **Property 10: Block Component Mapping**
    - **Validates: Requirements 4.5**

  - [ ] 11.3 Write unit tests for block rendering
    - Test each block type renders with correct component
    - Test unknown block type handling
    - Test blocks render in correct order
    - _Requirements: 4.5_

- [ ] 12. Checkpoint - Ensure article page tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Update homepage
  - [ ] 13.1 Update `frontend/src/pages/index.astro`
    - Import `fetchHomePage()` and `fetchArticles()`
    - Fetch homepage data and first 3 articles
    - Replace hardcoded hero content with CMS data
    - Add featured articles section
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 13.2 Write property test for homepage hero display
    - **Property 11: Homepage Hero Display**
    - **Validates: Requirements 5.3, 5.4**

  - [ ] 13.3 Write property test for featured articles limit
    - **Property 12: Featured Articles Limit**
    - **Validates: Requirements 5.5**

  - [ ] 13.4 Write unit tests for homepage
    - Test hero section renders with CMS data
    - Test featured articles section renders
    - Test maximum 3 featured articles displayed
    - _Requirements: 5.1, 5.2, 5.5_

- [ ] 14. Add comprehensive error handling
  - [ ] 14.1 Enhance error messages throughout API client
    - Add context to all error messages
    - Include request details in errors
    - Add error logging
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ] 14.2 Write unit tests for all error scenarios
    - Test each error type throws correct message
    - Test error messages include helpful context
    - Test errors during build fail the build
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 15. Install and configure testing dependencies
  - [ ] 15.1 Add testing packages to `frontend/package.json`
    - Install vitest
    - Install fast-check for property-based testing
    - Install @vitest/ui for test UI
    - Configure vitest in `vitest.config.ts`
    - _Requirements: Testing Strategy_

  - [ ] 15.2 Create test utilities and generators
    - Create `frontend/src/lib/test-utils.ts`
    - Implement arbitraries for fast-check (article, author, category, blocks)
    - Implement mock Strapi API responses
    - _Requirements: Testing Strategy_

- [ ] 16. Final integration testing
  - [ ] 16.1 Write integration tests for full build process
    - Test complete build with mock Strapi API
    - Test all pages generate correctly
    - Test data flows from API to HTML
    - _Requirements: All_

  - [ ] 16.2 Manual testing checklist
    - Start Strapi backend with seed data
    - Build Astro frontend
    - Verify blog listing page shows articles
    - Verify category filtering works
    - Verify individual article pages load
    - Verify homepage shows hero and featured articles
    - Verify images load correctly
    - Test with empty Strapi database
    - Test with missing environment variables

- [ ] 17. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Documentation and deployment preparation
  - [ ] 18.1 Update README with integration instructions
    - Document environment variables
    - Document build process
    - Document Strapi content type requirements
    - Add troubleshooting section
    - _Requirements: All_

  - [ ] 18.2 Create deployment guide
    - Document Cloudflare Pages configuration
    - Document Strapi webhook setup
    - Document environment variable configuration in Cloudflare
    - _Requirements: All_

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation maintains the Zero-Gravity architecture: all content is static, no runtime API calls
