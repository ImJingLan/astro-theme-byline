/**
 * 封面图解析器。
 *
 * 图片就放在文章目录里（`2026/rp2350-passkey/cover.webp`）。
 * 用 Vite 的 `import.meta.glob` 在构建期把这些文件登记成模块，
 * Astro 会对它们做 hash 化、转 webp、输出宽高——和正文图片完全一致。
 *
 * 查找顺序：
 *   1. frontmatter 的 cover / banner / image / thumbnail
 *   2. 正文里的第一张图
 *   3. 都没有 → 由组件生成抽象封面
 */
import type { Post } from './posts';

type ImageModule = {
  default: { src: string; width: number; height: number };
};

/**
 * 预先登记 posts 目录下所有图片。
 * `eager: true` 让元数据在构建期就可用；`import: 'default'` 拿到的是
 * `{ src, width, height }` 形式的 ImageMetadata。
 */
const images = import.meta.glob<ImageModule>('/src/content/posts/**/*.{webp,jpg,jpeg,png,avif,gif,svg}', {
  eager: true,
  import: 'default',
});

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

/** 从正文里找第一张相对路径图片 */
function firstImageInBody(body: string): string | undefined {
  // Markdown 图片
  const md = body.match(/!\[[^\]]*\]\(([^)\s]+)\)/);
  if (md) return md[1];

  // HTML img
  const html = body.match(/<img\b[^>]*?\bsrc=["']([^"']+)["']/i);
  if (html) return html[1];

  return undefined;
}

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
 * 取文章封面。
 * @param post 文章
 * @param fallbackToBody 没有封面字段时，是否用正文第一张图
 */
export function postCover(post: Post, fallbackToBody = true): CoverInfo | undefined {
  const declared = post.data.coverFile;
  if (declared) {
    const resolved = resolveImage(post.id, declared);
    if (resolved) return resolved;
  }

  if (fallbackToBody) {
    const fromBody = firstImageInBody(post.body ?? '');
    if (fromBody && !/^[a-z]+:\/\//i.test(fromBody)) {
      const resolved = resolveImage(post.id, fromBody);
      if (resolved) return resolved;
    }
  }

  return undefined;
}
