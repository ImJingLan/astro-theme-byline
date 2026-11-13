import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 博文集。直接兼容 Hexo / Hugo 的 frontmatter：
 *   - title / date / categories / tags
 *   - description / excerpt → summary
 *   - cover / banner / image / thumbnail → cover（可选，字符串）
 *
 * 目录结构：每 posts是 `YYYY/<slug>/index.md`，图片放在同一目录。
 * 正文图片由 Astro 原生管线解析，无需任何额外脚本。
 */
// YAML 里 `tags:` 留空会被解析成 null，必须允许
const list = z.union([z.string(), z.array(z.union([z.string(), z.number()])), z.null()]).optional();

const posts = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*', '!**/.*'], base: './src/content/posts' }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().nullish(),
      summary: z.string().nullish(),
      description: z.string().nullish(),
      excerpt: z.string().nullish(),
      categories: list,
      category: list,
      tags: list,
      tag: list,
      /**
       * 封面：写文章目录里的文件名，例如 cover: "cover.webp"。
       * 留空或缺失时，由组件自动从正文取第一张图。
       */
      cover: z.string().nullish(),
      banner: z.string().nullish(),
      image: z.string().nullish(),
      thumbnail: z.string().nullish(),
      coverAlt: z.string().nullish(),
      author: z.string().nullish(),
      /** 置顶到首页 */
      sticky: z.coerce.number().nullish(),
      draft: z.boolean().default(false),
    })
    // 保留 lang、copyright 等 Hexo 额外字段，不做校验
    .passthrough()
    .transform((data) => {
      const toArray = (value: string | Array<string | number> | null | undefined) => {
        if (value === null || value === undefined) return [];
        const items = Array.isArray(value) ? value : [value];
        return items.map((item) => String(item).trim()).filter(Boolean);
      };

      return {
        ...data,
        categories: toArray(data.categories ?? data.category),
        tags: [...toArray(data.tags), ...toArray(data.tag)],
        summary: data.summary ?? data.description ?? data.excerpt ?? '',
        /** 封面文件名（同目录），由 lib/covers.ts 解析成最终 URL */
        coverFile: (data.cover ?? data.banner ?? data.image ?? data.thumbnail ?? '')
          .replace(/^['"]+|['"]+$/g, '')
          .trim()
          .split('/')
          .pop() || '',
      };
    }),
});

/** 独立页面（关于、友链、公告等），同样兼容 Hexo 的 pages 目录 */
const pages = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/.*'], base: './src/content/pages' }),
  schema: z
    .object({
      title: z.string(),
      /** 显式指定路由，如 "/favicon/v2"；不写则用目录结构 */
      path: z.string().nullish(),
      date: z.coerce.date().nullish(),
      description: z.string().nullish(),
      /** 友链开关，数据在 src/content/_data/friends.json */
      friends: z
        .object({
          show: z.boolean().optional().default(false),
          siteTitle: z.string().optional().default('This site'),
          listTitle: z.string().optional().default('Friends'),
        })
        .nullish(),
      draft: z.boolean().default(false),
    })
    // 保留 Hexo 页面里可能出现的其它字段
    .passthrough(),
});

export const collections = { posts, pages };
