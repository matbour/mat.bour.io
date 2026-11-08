// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mat.bour.io',
  trailingSlash: 'ignore',
  redirects: {
    '/posts/fibre-dans-le-gtl': '/posts/meilleur-setup-fibre-2026',
  },
  // Astro 7 defaults to 'jsx', which drops spaces between inline elements in templates.
  compressHTML: true,
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: false,
    },
  },
});
