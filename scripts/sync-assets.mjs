/**
 * 构建前同步博文配图。
 *
 * Hexo 的文章目录里通常紧挨着 index.md 放着图片（cover.webp、1.webp、tutorial/...）。
 * 这些文件需要出现在站点根目录下才能被 <img src> 直接引用，因此复制到：
 *   src/content/posts/2026/rp2350-passkey/x.webp  →  public/content/2026/rp2350-passkey/x.webp
 *
 * 只复制图片/媒体，跳过 markdown 自身，避免把源码投到产物里。
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sources = [
  { from: 'src/content/posts', to: 'public/content' },
  { from: 'src/content/pages', to: 'public/content-pages' },
];

const MEDIA = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.bmp', '.ico',
  '.mp4', '.webm', '.mp3', '.wav', '.pdf',
]);

function walk(dir, onFile, depth = 0) {
  if (depth > 6 || !fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, onFile, depth + 1);
    else onFile(abs);
  }
}

function sync() {
  let copied = 0;
  let skipped = 0;

  for (const { from, to } of sources) {
    const src = path.join(root, from);
    if (!fs.existsSync(src)) continue;

    walk(src, (file) => {
      const ext = path.extname(file).toLowerCase();
      if (!MEDIA.has(ext)) {
        skipped++;
        return;
      }
      const rel = path.relative(src, file);
      const dest = path.join(root, to, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });

      // 文件大小和修改时间都一致时跳过，避免每次都全量拷贝
      if (fs.existsSync(dest)) {
        const a = fs.statSync(file);
        const b = fs.statSync(dest);
        if (a.size === b.size && Math.abs(a.mtimeMs - b.mtimeMs) < 2000) return;
      }
      fs.copyFileSync(file, dest);
      copied++;
    });
  }

  console.log(`[sync-assets] copied ${copied} media file(s), skipped ${skipped} non-media file(s)`);
}

sync();
