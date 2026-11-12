// 日期与排版辅助函数
const LOCALE = 'en-US';

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

export const formatShortDate = (date: Date) =>
  new Intl.DateTimeFormat(LOCALE, { month: 'short', day: 'numeric' }).format(date);

/** 磁贴上用的相对时间，模仿 Newsroom 的 “Yesterday” 文案 */
export function formatRelative(date: Date, now = new Date()) {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);

  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return formatShortDate(date);
}

/** 估算阅读时长（200 词/分钟） */
export const readingTime = (body = '') => {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

export const isoDate = (date: Date) => date.toISOString();
