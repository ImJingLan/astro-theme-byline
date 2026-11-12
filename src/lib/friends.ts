/**
 * 友链数据读取。
 *
 * 数据放在 `src/content/_data/friends.json`：
 *   - 和内容在一起，迁移博客时整体搬 src/content 即可
 *   - `_` 前缀不会被当成页面路由，也不会被 content-assets 插件发布
 */
import fs from 'node:fs';
import path from 'node:path';

export interface Friend {
  title: string;
  description: string;
  link: string;
  avatar: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'src/content/_data');

let cache: Friend[] | null = null;

/** 读取并校验 friends.json；文件不存在时返回空数组 */
export async function getFriends(): Promise<Friend[]> {
  if (cache) return cache;

  const file = path.join(DATA_DIR, 'friends.json');
  if (!fs.existsSync(file)) {
    cache = [];
    return cache;
  }

  try {
    const raw = fs.readFileSync(file, 'utf-8');
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      cache = [];
      return cache;
    }

    cache = parsed
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        title: String(item.title ?? '').trim(),
        description: String(item.description ?? '').trim(),
        link: String(item.link ?? '').trim(),
        avatar: String(item.avatar ?? '').trim(),
      }))
      .filter((item) => item.title && item.link);

    return cache;
  } catch (error) {
    console.warn(`[friends] failed to read ${file}: ${String(error)}`);
    cache = [];
    return cache;
  }
}
