/**
 * 时间轴的后续分页。
 *
 * 首屏由 Timeline.astro 直接渲染成 HTML，剩下的放在这里：
 * 点击「加载更多」时才取，页面的初始体积不跟着条目数涨。
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import {
  getTimeline,
  groupByMonth,
  paginateGroups,
  toPayload,
} from '../../lib/timeline';

/** 找出启用时间轴的页面，用它的配置决定怎么切页 */
async function optionsFromContent() {
  const pages = await getCollection('pages', ({ data }) => !data.draft);
  const entry = pages.find((page) => page.data.timeline?.show);
  if (!entry) return null;

  const config = entry.data.timeline!;

  return {
    limit: config.limit ?? 50,
    includeSelf: config.includeSelf ?? true,
    includeFriends: config.includeFriends ?? true,
    friendPosts: config.friendPosts ?? 3,
    pageSize: config.pageSize ?? 10,
  };
}

export const getStaticPaths = (async () => {
  const options = await optionsFromContent();
  if (!options) return [];

  const entries = await getTimeline(options);
  const pages = paginateGroups(groupByMonth(entries), options.pageSize);

  // 第 1 页已经写进 HTML，这里只出 2 以后
  return pages.slice(1).map((_, index) => ({
    params: { page: String(index + 2) },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const options = await optionsFromContent();
  const page = Number(params.page);

  if (!options || !Number.isInteger(page) || page < 2) {
    return new Response('[]', {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const entries = await getTimeline(options);
  const pages = paginateGroups(groupByMonth(entries), options.pageSize);
  const groups = pages[page - 1] ?? [];

  return new Response(JSON.stringify(toPayload(groups)), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
