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
 * 关键区别：
 *   pages 目录的文件是「独立资源」，全部发布。
 *   posts 目录的图片会被 Markdown 引用，Astro 已经把它们优化并输出到
 *   /assets/ 下了；这里只发布**正文没有引用**的附属文件（比如
 *   site.webmanifest、icon_raw.tar.gz），否则同一张图会存三份。
 *
 * `.md` 自身不发布（由页面路由渲染）。
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
 * 收集目录下的静态文件。
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

/**
 * 从 frontmatter 里取出封面字段（cover / banner / image / thumbnail）。
 * 这些图由 lib/covers.ts 通过 import.meta.glob 交给 Astro 处理，
 * 因此不需要再原样发布。
 */
function coverFiles(markdown) {
  const names = new Set();
  const m = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return names;

  for (const line of m[1].split(/\r?\n/)) {
    const field = line.match(/^\s*(cover|banner|image|thumbnail):\s*(.*)$/);
    if (!field) continue;

    const value = field[2].trim().replace(/^['"]+|['"]+$/g, '').trim();
    if (!value || /^[a-z]+:\/\//i.test(value)) continue;

    const name = value.replace(/\\/g, '/').split('/').pop();
    if (name) names.add(name.toLowerCase());
  }

  return names;
}

/**
 * 找出文章正文里引用到的图片文件名。
 * 同时覆盖 Markdown 与 HTML 两种写法。
 */
function referencedFiles(body) {
  const names = new Set();

  const patterns = [
    /!\[[^\]]*\]\(([^)\s]+)\)/g, // ![alt](path)
    /<img\b[^>]*?\bsrc=["']([^"']+)["']/gi, // <img src="path">
  ];

  for (const re of patterns) {
    let match;
    while ((match = re.exec(body)) !== null) {
      const raw = match[1];
      if (!raw || /^[a-z]+:\/\//i.test(raw) || raw.startsWith('data:')) continue;

      // 去掉查询串与锚点，取最后一段文件名
      const clean = raw.split(/[?#]/)[0];
      const name = clean.replace(/\\/g, '/').split('/').pop();
      if (name) names.add(name.toLowerCase());
    }
  }

  return names;
}

/** 建立 URL → 文件绝对路径的映射表 */
function buildMap(root) {
  const map = new Map();

  // 独立页面：pages/<...> → /<...>，全部发布
  collect(path.join(root, CONTENT_ROOT, 'pages'), '', map, 0);

  // 文章目录：只发布正文没引用的附属文件
  const postsDir = path.join(root, CONTENT_ROOT, 'posts');
  if (!fs.existsSync(postsDir)) return map;

  for (const year of fs.readdirSync(postsDir, { withFileTypes: true })) {
    if (!year.isDirectory() || year.name.startsWith('_') || year.name.startsWith('.')) continue;
    const yearDir = path.join(postsDir, year.name);

    for (const slug of fs.readdirSync(yearDir, { withFileTypes: true })) {
      if (!slug.isDirectory() || slug.name.startsWith('_') || slug.name.startsWith('.')) continue;

      const postDir = path.join(yearDir, slug.name);
      const mdFile = path.join(postDir, 'index.md');

      // 读文章，收集已被 Astro 处理的图片（正文引用 + frontmatter 封面）
      let used = new Set();
      try {
        if (fs.existsSync(mdFile)) {
          const markdown = fs.readFileSync(mdFile, 'utf-8');
          used = new Set([...referencedFiles(markdown), ...coverFiles(markdown)]);
        }
      } catch {
        used = new Set();
      }

      // 单独收集，再按引用过滤
      const assets = new Map();
      collect(postDir, '/' + year.name + '/' + slug.name, assets, 0);

      for (const [url, file] of assets) {
        const name = path.basename(file).toLowerCase();
        // 正文引用的图已由 Astro 优化输出到 /assets/，这里跳过避免重复
        if (used.has(name)) continue;
        map.set(url, file);
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
