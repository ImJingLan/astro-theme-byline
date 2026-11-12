// 日期与排版辅助函数
const LOCALE = 'zh-CN';

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

export const formatShortDate = (date: Date) =>
  new Intl.DateTimeFormat(LOCALE, { month: 'short', day: 'numeric' }).format(date);

export const formatMonth = (date: Date) =>
  new Intl.DateTimeFormat(LOCALE, { year: 'numeric', month: 'long' }).format(date);

/** 磁贴上用的相对时间 */
export function formatRelative(date: Date, now = new Date()) {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);

  if (days <= 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 周前`;
  return formatShortDate(date);
}

/**
 * 估算阅读时长。中文按每分钟约 350 字，西文按每分钟 200 词混算。
 */
export const readingTime = (body = '') => {
  const text = body.trim();
  if (!text) return 1;
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = text.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(cjk / 350 + words / 200));
};

export const isoDate = (date: Date) => date.toISOString();

/** 从正文里提取纯文本摘要（去掉 Markdown 标记、图片、代码块） */
export function excerptFromBody(body: string, limit = 90) {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/[*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}…`;
}
