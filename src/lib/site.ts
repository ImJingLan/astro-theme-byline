// 站点级配置：改这里就能换成你自己的品牌
export const site = {
  name: 'Example',
  title: 'Example Blog',
  description: 'A quiet editorial blog theme for Astro and Tailwind CSS.',
  locale: 'zh-CN',
  /** 作者名，用于 byline */
  author: 'Example Author',
  /** 首页顶部的一段自我介绍 */
  intro: {
    eyebrow: 'Blog',
    heading: 'Stories worth keeping.',
    lead: 'A demo blog built with this theme.',
  },
  // 主站导航（对应 Apple 的 globalnav：44px 高、深色、12px 链接）
  globalNav: [
    { label: '首页', href: '/' },
    { label: '归档', href: '/archive/' },
    { label: '分类', href: '/categories/' },
    { label: '标签', href: '/tags/' },
    { label: '关于', href: '/about/' },
  ],
  // 博客子导航（对应 Apple 的 localnav）
  localNav: [
    { label: '最新', href: '/' },
    { label: '归档', href: '/archive/' },
    { label: '关于', href: '/about/' },
  ],
  social: [
    { label: 'RSS', href: '/rss.xml' },
    { label: 'GitHub', href: 'https://github.com/example' },
  ],
} as const;

/**
 * In the Loop 画廊的行为开关。
 * 改这里就能决定是否显示左右翻页箭头 / 底部圆点导航，无需改动组件。
 */
export const gallery = {
  /** 左右翻页箭头 */
  showArrows: true,
  /** 底部圆点导航 */
  showDots: true,
  /**
   * 箭头位置：
   * - 'head'    与区块标题同一行，靠右（默认，最贴近编辑式排版）
   * - 'overlay' 悬浮在卡片两侧，鼠标悬停时显现
   */
  arrowPlacement: 'head' as 'head' | 'overlay',
  /** 画廊区块标题 */
  title: '随便看看',
  /** 从最新文章之后取几条 */
  count: 6,
} as const;

/**
 * 首页「最新文章」区块的配置。
 */
export const home = {
  /**
   * 展示几篇。
   * 1 篇做通栏头条，其余按 12 列网格铺开：
   *   6 篇 → 头条 1 + 两列 2 + 三列 3（刚好排满）
   *   5 篇 → 三列那行会空一格
   */
  latestCount: 6,
  /** 下面「更多文章」列表取几篇 */
  moreCount: 8,
} as const;

/**
 * 分类直接来自文章 frontmatter，这里只放展示顺序与可选描述。
 * 未列出的分类会按文章数量自动排在后面。
 */
export const categoryOrder = ['技术', '开箱', '项目', '信竞', '随笔', '杂谈', '站点公告'] as const;

export const categoryDescriptions: Record<string, string> = {
  技术: '折腾记录：服务器、单片机、开发工具。',
  开箱: '买回来拆开、用一段时间、再写下来。',
  项目: '自己写的东西，以及为什么这么写。',
  信竞: '竞赛留下的算法与题解。',
  随笔: '生活里的一些片段。',
  杂谈: '没什么主题的碎碎念。',
  站点公告: '关于这个博客本身的变化。',
};

/** 把分类名转成 URL 片段（中文分类也保持可读，浏览器会自动编码） */
export const categorySlug = (name: string) => encodeURIComponent(name);

export const categoryHref = (name: string) => `/categories/${categorySlug(name)}/`;
export const tagHref = (name: string) => `/tags/${encodeURIComponent(name)}/`;

export const categoryLabel = (name: string) => name;
