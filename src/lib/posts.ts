import { getCollection, type CollectionEntry } from 'astro:content';
import { categoryOrder } from './site';

export type Post = CollectionEntry<'posts'>;


/** 按置顶权重、再按日期倒序排序 */
export function sortPosts(posts: Post[]) {
  return [...posts].sort((a, b) => {
    const sticky = (b.data.sticky ?? 0) - (a.data.sticky ?? 0);
    if (sticky !== 0) return sticky;
    return b.data.date.getTime() - a.data.date.getTime();
  });
}

export async function getAllPosts() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return sortPosts(posts);
}

/**
 * 文章 URL：直接保留年份目录，如 2026/rp2350-passkey → /2026/rp2350-passkey/
 * 和原博客的 permalink 保持一致。
 */
export const postHref = (post: { id: string }) => `/${post.id}/`;

/** 统计分类，按预设顺序排列，未列出的按数量排序 */
export function collectCategories(posts: Post[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const name of post.data.categories) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }

  const order = new Map(categoryOrder.map((name, index) => [name as string, index]));

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      const ai = order.get(a.name) ?? 999;
      const bi = order.get(b.name) ?? 999;
      if (ai !== bi) return ai - bi;
      return b.count - a.count;
    });
}

/** 统计标签 */
export function collectTags(posts: Post[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const name of post.data.tags) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}

/** 按年月分组（posts 已按日期倒序，因此分组天然有序） */
export function groupByMonth(posts: Post[]) {
  const groups: { key: string; date: Date; posts: Post[] }[] = [];
  for (const post of posts) {
    const date = post.data.date;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.posts.push(post);
    else groups.push({ key, date, posts: [post] });
  }
  return groups;
}
