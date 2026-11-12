// 站点级配置：改这里就能换成你自己的品牌
export const site = {
  name: 'Example Blog',
  title: 'Example Blog',
  description: 'A quiet editorial blog theme for Astro and Tailwind CSS.',
  locale: 'zh-CN',
  /** 作者名，用于 byline */
  author: 'Example Author',
  /**
   * 站点图标（导航栏左侧）。
   * - 留空则显示内置的方块占位图标
   * - 写 /favicon/v2/icon@256px.png 这类站点路径，或完整外链
   */
  logo: '',
  /**
   * 站点 favicon（浏览器标签页图标）。
   * 留空则不输出 <link rel="icon">，由浏览器请求 /favicon.ico。
   * 例：'/favicon/v2/favicon-32x32.png'
   */
  favicon: '',
  /** 首页顶部的一段自我介绍 */
  intro: {
    eyebrow: 'Byline',
    heading: 'Stories worth keeping.',
    lead: 'A demo blog built with this theme.',
  },
  // 全站唯一的导航栏（浅色吸顶）
  globalNav: [
    { label: '首页', href: '/' },
    { label: '归档', href: '/archive/' },
    { label: '分类', href: '/categories/' },
    { label: '标签', href: '/tags/' },
    { label: '关于', href: '/about/' },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/example' },
  ],
} as const;

/**
 * 画廊的行为开关。
 * 改这里就能决定是否显示整个区块 / 左右翻页箭头 / 底部圆点导航，无需改动组件。
 */
export const gallery = {
  /** 是否显示整个画廊区块；设为 false 则整块不渲染 */
  enable: true,
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
 * 默认封面。
 *
 * 文章没写 cover、正文里也没有图片时，从下面的列表里挑一张。
 *
 * 图片放这里：src/assets/covers/
 * 只写文件名即可，例如 '01.webp'，不需要写路径。
 * 目录为空或不配置时，回退到程序生成的抽象封面（CoverArt）。
 *
 * 选择规则：用文章 id 的哈希取模，所以同一篇文章每次构建都拿到同一张图，
 * 不会出现「刷新一次换一张」的情况。
 */
export const defaultCovers = {
  /** 是否启用 */
  enable: true,
  /** 图片文件名列表（相对 src/assets/covers/） */
  images: [] as string[],
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
