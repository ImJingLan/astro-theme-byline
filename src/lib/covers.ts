/**
 * 封面图解析。
 *
 * 图片放在文章目录里，用 import.meta.glob 在构建期登记，
 * Astro 会做 hash、转 webp、输出宽高。
 *
 * 顺序：frontmatter 的 cover → 默认封面池 → 组件生成抽象封面。
 */
import type { Post } from './posts';
import { defaultCovers } from './site';

type ImageModule = {
  default: { src: string; width: number; height: number };
};

/** 构建期登记 posts 目录下的所有图片 */
const images = import.meta.glob<ImageModule>('/src/content/posts/**/*.{webp,jpg,jpeg,png,avif,gif,svg}', {
  eager: true,
  import: 'default',
});

/** 默认封面池，图片放 src/assets/covers/ */
const defaultPool = import.meta.glob<ImageModule>(
  '/src/assets/covers/*.{webp,jpg,jpeg,png,avif,gif,svg}',
  { eager: true, import: 'default' }
);

/** 按文件名排序，保证每次构建顺序一致 */
const defaultList = Object.keys(defaultPool)
  .sort()
  .map((key) => ({ key, name: key.split('/').pop() ?? key, meta: defaultPool[key] }));

export interface CoverInfo {
  src: string;
  width?: number;
  height?: number;
}

/** 把文章 id + 文件名拼成 glob 的 key */
const keyOf = (id: string, file: string) => {
  const clean = file.replace(/^\.?\//, '');
  return `/src/content/posts/${id}/${clean}`;
};

/** 解析单张图 */
function resolveImage(id: string, file: string): CoverInfo | undefined {
  if (!file) return undefined;

  // 外链直接用
  if (/^[a-z]+:\/\//i.test(file)) return { src: file };

  // 站点绝对路径（/2025/xx/cover.webp）→ 取最后两段作为文章目录
  const candidate = file.startsWith('/')
    ? `/src/content/posts${file}`
    : keyOf(id, file);

  const mod = images[candidate];
  if (mod) {
    return { src: mod.src, width: mod.width, height: mod.height };
  }

  // 文件名大小写不一致时再宽容匹配一次（如 Cover.webp）
  const lower = candidate.toLowerCase();
  const hit = Object.keys(images).find((k) => k.toLowerCase() === lower);
  if (hit) {
    const m = images[hit];
    return { src: m.src, width: m.width, height: m.height };
  }

  return undefined;
}

/**
 * 取文章封面（列表页缩略图用）。
 *
 * 只认 frontmatter 里显式配置的封面；没有则从默认封面池挑一张。
 * 不再回退到正文里的第一张图 —— 正文插图通常和「封面」无关，
 * 拿它当缩略图容易误导。
 */
export function postCover(post: Post): CoverInfo | undefined {
  const declared = post.data.coverFile;
  if (declared) {
    const resolved = resolveImage(post.id, declared);
    if (resolved) return resolved;
  }

  return pickDefaultCover(post.id);
}

/** 简单的字符串哈希，用于稳定地选一张默认封面 */
function hashId(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * 从默认封面池里挑一张。
 *
 * 优先用 site.ts 里 defaultCovers.images 指定的文件名（可只列一部分），
 * 没配置则用目录里全部图片。用文章 id 哈希取模，保证同一 posts结果稳定。
 */
function pickDefaultCover(id: string): CoverInfo | undefined {
  if (!defaultCovers.enable || defaultList.length === 0) return undefined;

  // 配置里指定了文件名时，按配置过滤并保持配置顺序
  const configured = defaultCovers.images.filter(Boolean);
  const pool =
    configured.length > 0
      ? configured
          .map((name) => defaultList.find((item) => item.name === name))
          .filter((item): item is (typeof defaultList)[number] => Boolean(item))
      : defaultList;

  if (pool.length === 0) return undefined;

  const item = pool[hashId(id) % pool.length];
  const meta = item.meta;
  if (!meta?.src) return undefined;

  return { src: meta.src, width: meta.width, height: meta.height };
}

/**
 * 只取文章显式配置的封面，不回退到默认池。
 *
 * 文章详情页的头图用它：没配 cover 就不显示大图，
 * 否则每 posts顶部都会被塞一张和内容无关的默认图。
 */
export function postDeclaredCover(post: Post): CoverInfo | undefined {
  const declared = post.data.coverFile;
  if (!declared) return undefined;
  return resolveImage(post.id, declared);
}
