// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://dutra-farma.sites.rushcms.com',
  vite: {
    plugins: [
      tailwindcss(),
      Icons({ compiler: 'astro' })
    ]
  },

  integrations: [sitemap()]
});