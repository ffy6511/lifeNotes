import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com',
    integrations: [mdx(), sitemap(), preact()],
    output: 'static', // 生成静态文件
    base: '/',        // 基础路径
    build: {
        outDir: './dist', // 指定输出路径
    },
});