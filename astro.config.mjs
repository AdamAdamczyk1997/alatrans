import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alatrans.pl',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
