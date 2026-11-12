import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 博文集。直接兼容 Hexo / Hugo 的 frontmatter：
 *   - title      → title
 *   - date       → date
 *   - categories → categories（字符串或数组）
 *   - tags       → tags（字符串或数组）
 *   - description / excerpt → summary
 *   - cover / banner / image → cover
 *
 * 每篇文章可以是单文件 index.md（带同名目录下的图片），也可以是普通 .md 文件。
 * 目录结构（如 2026/rp2350-passkey/index.md）会被保留为 id，因此无需改动原博客。
 */
const list = z.union([z.string(), z.array(z.string())]).optional();

const posts = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*', '!**/.*'], base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      summary: z.string().optional(),
      description: z.string().optional(),
      excerpt: z.string().optional(),
      categories: list,
      category: list,
      tags: list,
      /** 兼容 Hexo 的 cover / banner / image */
      cover: z.string().optional(),
      banner: z.string().optional(),
      image: z.string().optional(),
      coverAlt: z.string().optional(),
      author: z.string().optional(),
      /** 置顶到首页 */
      sticky: z.coerce.number().optional(),
      draft: z.boolean().default(false),
    }).transform((data) => {
      const toArray = (value?: string | string[]) =>
        (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean);

      return {
        ...data,
        categories: toArray(data.categories ?? data.category),
        tags: toArray(data.tags),
        summary: data.summary ?? data.description ?? data.excerpt ?? '',
        cover: data.cover ?? data.banner ?? data.image,
      };
    }),
});

/** 独立页面（关于、友链、公告等），同样兼容 Hexo 的 pages 目录 */
const pages = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/.*'], base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    path: z.string().optional(),
    date: z.coerce.date().optional(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, pages };
