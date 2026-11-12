/**
 * 把文章里相对的图片路径（Hexo 写法）解析成可直接用于 <img src> 的地址。
 *
 * 支持三种常见写法：
 *   ![](image.webp)
 *   ![alt](./image.webp)
 *   <img src="image.webp">
 *
 * 在构建时扫描 src/content/posts 下的一级目录名，把 `2026/rp2350-passkey/a.webp`
 * 这类路径映射到 `public/content/<id>/a.webp`，文章不用改任何一处。
 */
import fs from 'node:fs';
import path from 'node:path';

const postsRoot = path.resolve(process.cwd(), 'src/content/posts');
const pagesRoot = path.resolve(process.cwd(), 'src/content/pages');

const isAbsolute = (src: string) =>
  /^(?:[a-z]+:)?\/\//i.test(src) || src.startsWith('/') || src.startsWith('#') || src.startsWith('data:');

/** 枚举所有文章目录（含年份前缀的那种嵌套路径） */
function collectDirs(root: string, prefix = '', out: string[] = [], depth = 0): string[] {
  if (!fs.existsSync(root) || depth > 4) return out;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const abs = path.join(root, entry.name);
    if (fs.existsSync(path.join(abs, 'index.md'))) out.push(rel);
    collectDirs(abs, rel, out, depth + 1);
  }
  return out;
}

const postDirs = collectDirs(postsRoot);
// 长路径优先匹配，避免 2026 误吞 2026/rp2350-passkey
postDirs.sort((a, b) => b.length - a.length);

/** 文章 id 时，其资源根目录 */
const assetBaseFor = (id: string) => `/content/${id}/`;

/**
 * 解析单张图片。返回可直接使用的 src；找不到时返回原值，方便排查。
 */
export function resolveAsset(src: string, id: string, kind: 'posts' | 'pages' = 'posts'): string {
  if (!src || isAbsolute(src)) return src;

  const clean = src.replace(/^\.\//, '');

  // 已经是 content 资源路径
  if (clean.startsWith('content/')) return `/${clean}`;

  const candidates: string[] = [];

  // 1) 相对于文章目录
  const root = kind === 'posts' ? postsRoot : pagesRoot;
  candidates.push(path.join(root, id, clean));

  // 2) 相对于文章目录的上一级（图片写在年份目录里）
  candidates.push(path.join(root, path.dirname(id), clean));

  // 3) 相对站点根的 content 目录
  candidates.push(path.join(process.cwd(), 'src/content', clean));

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      const rel = path.relative(path.join(process.cwd(), 'src/content'), candidate);
      const [prefix, ...rest] = rel.split(path.sep);
      // posts/2026/rp2350-passkey/img.webp → public/content/2026/rp2350-passkey/img.webp
      return `/content/${rest.join('/')}`;
    }
  }

  // 4) 图片可能直接放在 id 目录下，只是带了子路径
  const direct = path.join(root, id, clean);
  if (fs.existsSync(direct)) return `${assetBaseFor(id)}${clean}`;

  return src;
}

/** 批量替换 Markdown 与 HTML 中的相对图片路径 */
export function rewriteImages(html: string, id: string, kind: 'posts' | 'pages' = 'posts'): string {
  return html.replace(
    /(<img\b[^>]*?\bsrc=)(["'])([^"']+)(\2)/gi,
    (_m, pre, q1, src, q2) => `${pre}${q1}${resolveAsset(src, id, kind)}${q2}`
  );
}

/** Markdown 源码中的图片路径（用于在渲染前替换，交给 Markdown 处理） */
export function rewriteMarkdownImages(markdown: string, id: string, kind: 'posts' | 'pages' = 'posts'): string {
  return markdown.replace(/(!\[[^\]]*\]\()([^)\s]+)(\))/g, (_m, pre, src, post) => {
    return `${pre}${resolveAsset(src, id, kind)}${post}`;
  });
}

export const postDirsList = postDirs;
