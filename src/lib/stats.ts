/**
 * 首页统计：字数与运行时间。
 */

import { site } from './site';

/** Markdown 还原成读者实际看到的文字：去掉代码、图片、标记 */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[`*_~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 统计一篇正文的字数。
 * 中文按字计，西文按词计，与阅读时长的口径保持一致。
 */
export function countWords(markdown: string): number {
  const text = toPlainText(markdown);
  if (!text) return 0;
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const latin = text.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(Boolean).length;
  return cjk + latin;
}

/** 全站总字数，超过一万时用「万」显示 */
export function formatWordCount(total: number): string {
  if (total >= 10000) return `${(total / 10000).toFixed(1)}k`;
  return total.toLocaleString(site.lang);
}

/**
 * 站点运行时间，从最早一 posts的日期算起。
 * 用 UTC 固定时刻，观者时区不影响结果。
 */
export const SITE_BIRTH_MS = Date.UTC(2022, 1, 10, 0, 0, 0);

const pad = (n: number) => String(n).padStart(2, '0');

/** 「1916天19小时2357秒」——天、小时、小时内秒数 */
export function formatUptime(now = Date.now()): string {
  const elapsed = Math.max(0, now - SITE_BIRTH_MS);
  const totalSeconds = Math.floor(elapsed / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const seconds = totalSeconds % 3600;
  return `${days}d ${pad(hours)}h ${pad(seconds)}s`;
}
