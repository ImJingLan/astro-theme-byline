/**
 * 内容目录里的静态资源 → 同名 URL。
 *
 * 需求：`src/content/pages/favicon/v2/favicon.ico` 要能通过
 * `/favicon/v2/favicon.ico` 访问，且不复制文件。
 *
 * 做法：
 *   - dev：注册中间件，命中路径就直接读文件返回
 *   - build：在 generateBundle 阶段用 emitFile 把文件写进产物
 *
 * 映射规则（与页面路由一致）：
 *   src/content/pages/<dir>/<file>      → /<dir>/<file>
 *   src/content/posts/<year>/<slug>/<f> → /<year>/<slug>/<f>
 *
 * `.md` 自身不发布（由页面路由渲染），其余文件原样发布。
 */
import fs from 'node:fs';
import path from 'node:path';

const CONTENT_ROOT = 'src/content';
const SKIP_EXT = new Set(['.md', '.mdx']);

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.pdf': 'application/pdf',
  '.gz': 'application/gzip',
  '.zip': 'application/zip',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

const contentTypeOf = (file) => MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';

/**
 * 递归收集可发布的静态文件。
 * @param {string} dir 当前目录
 * @param {string} urlPrefix 对应的 URL 前缀
 * @param {Map<string, string>} out 结果表
 * @param {number} depth 递归深度
 */
function collect(dir, urlPrefix, out, depth) {
  if (depth > 8 || !fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;

    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // _data 之类的下划线目录不发布
      if (entry.name.startsWith('_')) continue;
      collect(abs, urlPrefix + '/' + entry.name, out, depth + 1);
      continue;
    }

    if (SKIP_EXT.has(path.extname(entry.name).toLowerCase())) continue;

    out.set(urlPrefix + '/' + entry.name, abs);
  }
}

/** 建立 URL → 文件绝对路径的映射表 */
function buildMap(root) {
  const map = new Map();

  // 独立页面：pages/<...> → /<...>
  collect(path.join(root, CONTENT_ROOT, 'pages'), '', map, 0);

  // 文章目录：posts/<year>/<slug>/... → /<year>/<slug>/...
  const postsDir = path.join(root, CONTENT_ROOT, 'posts');
  if (fs.existsSync(postsDir)) {
    for (const year of fs.readdirSync(postsDir, { withFileTypes: true })) {
      if (!year.isDirectory() || year.name.startsWith('_') || year.name.startsWith('.')) continue;
      const yearDir = path.join(postsDir, year.name);
      for (const slug of fs.readdirSync(yearDir, { withFileTypes: true })) {
        if (!slug.isDirectory() || slug.name.startsWith('_') || slug.name.startsWith('.')) continue;
        collect(path.join(yearDir, slug.name), '/' + year.name + '/' + slug.name, map, 0);
      }
    }
  }

  return map;
}

export default function contentAssets() {
  let root = process.cwd();
  let isBuild = false;
  let map = new Map();

  return {
    name: 'content-assets',
    enforce: 'pre',

    configResolved(config) {
      root = config.root;
      isBuild = config.command === 'build';
      map = buildMap(root);
    },

    // 开发服务器：命中就直接返回文件
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();

        let pathname;
        try {
          pathname = decodeURIComponent(req.url.split('?')[0]);
        } catch {
          return next();
        }

        const file = map.get(pathname);
        if (!file) return next();

        try {
          const body = fs.readFileSync(file);
          res.statusCode = 200;
          res.setHeader('Content-Type', contentTypeOf(file));
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
          res.end(body);
        } catch {
          next();
        }
      });
    },

    // 生产构建：把文件写进产物
    generateBundle() {
      if (!isBuild) return;

      for (const [url, file] of map) {
        try {
          this.emitFile({
            type: 'asset',
            fileName: url.replace(/^\//, ''),
            source: fs.readFileSync(file),
          });
        } catch (error) {
          this.warn('content-assets: failed to emit ' + url + ': ' + String(error));
        }
      }

      this.info('content-assets: emitted ' + map.size + ' static file(s)');
    },
  };
}
