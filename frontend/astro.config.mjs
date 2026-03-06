import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  integrations: [
    tailwind(),
    sitemap(),
    starlight({
      title: 'VibeBlocks',
      social: []
    })
  ]
});
