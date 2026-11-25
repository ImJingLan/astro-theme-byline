/** 时间轴：本站文章与友链文章按时间合并 */
import { getAllPosts, postHref, type Post } from './posts';
import { getFriendsWithPosts } from './friends';
import { postCover } from './covers';
import { withRef } from './links';
import { formatDate, formatMonth } from './format';
import { site } from './site';

/** 时间轴上的条目 */
export interface TimelineEntry {
  kind: 'self' | 'friend';
  title: string;
  link: string;
  date: Date;
  /** self 才有 */
  post?: Post;
  /** friend 才有 */
  site?: {
    title: string;
    link: string;
    avatar: string;
  };
}

/** 按月分组 */
export interface TimelineGroup {
  key: string;
  year: number;
  month: number;
  items: TimelineEntry[];
}

export interface TimelineOptions {
  /** 最多输出几条 */
  limit?: number;
  /** 是否包含本站文章 */
  includeSelf?: boolean;
  /** 是否包含友链文章；只看 mode 为 build 的 */
  includeFriends?: boolean;
  /** 友链每站取几条 */
  friendPosts?: number;
}

/**
 * 合并时间轴。
 *
 * 友链只取 mode === 'build' 的条目：dynamic 的文章在构建期没有数据，
 * 拿不到日期就没法排序。
 */
export async function getTimeline(options: TimelineOptions = {}): Promise<TimelineEntry[]> {
  const {
    limit = 50,
    includeSelf = true,
    includeFriends = true,
    friendPosts = 3,
  } = options;

  const entries: TimelineEntry[] = [];

  if (includeSelf) {
    for (const post of await getAllPosts()) {
      entries.push({
        kind: 'self',
        title: post.data.title,
        link: postHref(post),
        date: post.data.date,
        post,
      });
    }
  }

  if (includeFriends) {
    const friends = await getFriendsWithPosts(friendPosts);

    for (const friend of friends) {
      // dynamic 模式构建期没有文章，跳过
      if (friend.mode !== 'build') continue;

      const origin = {
        title: friend.title || site.name,
        link: friend.link,
        avatar: friend.avatar,
      };

      for (const post of friend.posts) {
        // 没有日期的条目没法排序，不放进时间轴
        if (!post.date) continue;

        entries.push({
          kind: 'friend',
          title: post.title,
          link: post.link,
          date: post.date,
          site: origin,
        });
      }
    }
  }

  entries.sort((a, b) => b.date.getTime() - a.date.getTime());

  return entries.slice(0, limit);
}

/** 按年月分组，保持时间倒序 */
export function groupByMonth(entries: TimelineEntry[]): TimelineGroup[] {
  const groups: TimelineGroup[] = [];

  for (const item of entries) {
    const year = item.date.getFullYear();
    const month = item.date.getMonth() + 1;
    const key = `${year}-${month}`;

    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(item);
    else groups.push({ key, year, month, items: [item] });
  }

  return groups;
}

/**
 * 把分组切成若干页。
 *
 * 每页尽量凑够 pageSize 条，但不切开同一个月：分组标题只写一次，
 * 跨页切断会让同一月份出现两个标题。
 */
export function paginateGroups(groups: TimelineGroup[], pageSize: number): TimelineGroup[][] {
  if (pageSize <= 0) return [groups];

  const pages: TimelineGroup[][] = [];
  let current: TimelineGroup[] = [];
  let count = 0;

  for (const group of groups) {
    current.push(group);
    count += group.items.length;

    if (count >= pageSize) {
      pages.push(current);
      current = [];
      count = 0;
    }
  }

  if (current.length) pages.push(current);

  return pages.length ? pages : [[]];
}

/**
 * 分组标题，跟着界面语言走。
 * 用 UTC 的第一天构造日期，避免本地时区把它推到上一个月。
 */
export function monthLabel(year: number, month: number): string {
  return formatMonth(new Date(Date.UTC(year, month - 1, 1)));
}

/** 缩略图：本站用封面，友链用对方头像 */
export function thumbFor(entry: TimelineEntry): string {
  if (entry.kind === 'self' && entry.post) return postCover(entry.post)?.src ?? '';
  return entry.site?.avatar ?? '';
}

/** 交给浏览器的条目；日期在构建期格式化好，免得各端时区不同 */
export interface TimelinePayloadItem {
  kind: 'self' | 'friend';
  title: string;
  /** 已经带 ?ref= 的地址 */
  link: string;
  dateISO: string;
  dateLabel: string;
  thumb: string;
  /** 友链才有；同时带上站点主页，供徽章链接 */
  siteTitle?: string;
  siteLink?: string;
}

export interface TimelinePayloadGroup {
  key: string;
  heading: string;
  items: TimelinePayloadItem[];
}

/** 把分组转成可 JSON 化的结构 */
export function toPayload(groups: TimelineGroup[]): TimelinePayloadGroup[] {
  return groups.map((group) => ({
    key: group.key,
    heading: monthLabel(group.year, group.month),
    items: group.items.map((item) => ({
      kind: item.kind,
      title: item.title,
      link: withRef(item.link),
      dateISO: item.date.toISOString(),
      dateLabel: formatDate(item.date),
      thumb: thumbFor(item),
      siteTitle: item.site?.title,
      siteLink: item.site ? withRef(item.site.link) : undefined,
    })),
  }));
}
