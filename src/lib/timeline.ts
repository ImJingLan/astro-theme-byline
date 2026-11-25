/** 时间轴：本站文章与友链文章按时间合并 */
import { getAllPosts, postHref, type Post } from './posts';
import { getFriendsWithPosts } from './friends';
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