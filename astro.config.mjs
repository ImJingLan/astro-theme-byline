import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import contentAssets from './src/plugins/content-assets.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  // 原博客的链接都带尾斜杠，保持一致
  trailingSlash: 'ignore',
  build: { format: 'directory', assets: 'assets' },
  vite: {
    plugins: [
      // 把 content 目录里的静态资源映射成同名 URL（不复制文件）
      contentAssets(),
      tailwindcss(),
    ],
  },
});
