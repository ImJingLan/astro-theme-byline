import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** 磁贴眉标，例如 UPDATE / PRODUCT / FEATURE */
      eyebrow: z.string().default('NEWS'),
      description: z.string(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      category: z.enum(['products', 'design', 'engineering', 'culture']),
      author: z.string().default('Lumen Newsroom'),
      /** 磁贴与头图的配图；不填时由组件生成渐变占位图 */
      cover: image().optional(),
      coverAlt: z.string().default(''),
      /** 首页磁贴尺寸：hero 为大图横版，2up 为两列，3up 为三列 */
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { articles };
