// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://dutrafarma.com.br',
  vite: {
    plugins: [
      tailwindcss(),
      Icons({ compiler: 'astro' })
    ]
  },

  integrations: [sitemap()]
});