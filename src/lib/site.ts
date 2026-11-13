/**
 * 站点配置。
 *
 * 只改这个文件就能把主题换成自己的站点，不需要动组件。
 * 下面全是演示值，替换成你自己的即可。
 */

// ---------------------------------------------------------------------------
// 基础信息
// ---------------------------------------------------------------------------
export const site = {
  /** 站点名，显示在导航栏与页脚 */
  name: 'Example Blog',
  /** 完整标题，用于 <title> 与 RSS */
  title: 'Example Blog',
  /** 一句话副标题，首页与 OG 描述用 */
  subtitle: 'A quiet editorial blog theme for Astro',
  /** SEO 描述 */
  description:
    'A quiet editorial blog theme for Astro and Tailwind CSS, with a newsroom-style layout.',
  /** SEO 关键词，逗号分隔 */
  keywords: 'example,blog,astro,tailwind,theme',
  /** 站点地址，用于 canonical 与 RSS，末尾不要带斜杠 */
  url: 'https://example.com',
  /**
   * 站点语言，BCP 47 标签（en / zh-CN / ja / pt-BR …）。
   *
   * 这一个值决定四件事：
   *   - <html lang>
   *   - 选哪份界面字典（src/i18n/）
   *   - 日期格式（Intl.DateTimeFormat）
   *   - og:locale 与 RSS <language>（自动转成 en_US 这种下划线写法）
   */
  lang: 'en',
  /** 作者名，用于 byline 与版权 */
  author: 'Example Author',
  /** 时区，影响日期格式化 */
  timezone: 'UTC',

  /**
   * 站点图标（导航栏左侧）。
   * - 留空则显示内置的方块占位图标
   * - 写 /logo.png 这类站点路径，或完整外链
   */
  logo: '',
  /**
   * 站点 favicon（浏览器标签页图标）。
   * 留空则使用内置的 /favicon.svg。
   */
  favicon: '',

  /** 首页顶部的一段自我介绍 */
  intro: {
    eyebrow: 'Byline',
    heading: 'Stories worth keeping.',
    lead: 'A demo blog built with this theme. Replace these posts with your own.',
  },

  /**
   * 导航栏。
   * description 只用于 SEO（生成 meta description 与 RSS），不影响显示。
   */
  globalNav: [
    { label: 'Home', href: '/', description: 'The latest posts and site statistics.' },
    { label: 'Archive', href: '/archive/', description: 'Every post, newest first, grouped by month.' },
    { label: 'Tags', href: '/tags/', description: 'Browse posts by topic.' },
    { label: 'Friends', href: '/friends/', description: 'Other blogs worth reading.' },
    { label: 'About', href: '/about/', description: 'About this site and the theme behind it.' },
  ],
} as const;

// ---------------------------------------------------------------------------
// 页脚
// ---------------------------------------------------------------------------
export const footer = {
  /**
   * 社交链接。key 决定图标，常用的有：
   * rss / github / twitter / bluesky / weibo / zhihu / facebook / email
   * 留空字符串的条目不会显示。
   */
  social: {
    rss: '/rss.xml',
    github: 'https://github.com/example',
    email: '',
    twitter: '',
    bluesky: '',
    weibo: '',
    zhihu: '',
    facebook: '',
  } as Record<string, string>,

  /** 备案信息；enable 为 false 时整条不显示 */
  icp: {
    enable: false,
    url: 'https://beian.miit.gov.cn',
    text: '',
  },

  /** 版权行；{year} 与 {author} 会被替换 */
  copyright: 'Copyright © {year} {author}. All rights reserved.',
  /** 右下角的构建说明，留空则不显示 */
  credit: 'Built with Astro & Tailwind CSS',
} as const;

// ---------------------------------------------------------------------------
// Open Graph 图片
// ---------------------------------------------------------------------------
export const ogImage = {
  /** 是否输出站点默认分享图（放一张 public/og-default.png 即可） */
  enable: false,
  /** 背景色 */
  bgColor: '#eaecf0',
  /** 主文字色 */
  fontColor: '#1e1e1e',
  /** 作者行文字色 */
  authorColor: '#444444',
} as const;

// ---------------------------------------------------------------------------
// 分页
// ---------------------------------------------------------------------------
export const pagination = {
  /** 归档页每页几篇 */
  archivePerPage: 6,
  /** 标签 / 分类详情页每页几篇 */
  taxonomyPerPage: 12,
} as const;

// ---------------------------------------------------------------------------
// 首页区块
// ---------------------------------------------------------------------------

/** In the Loop 画廊 */
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
  title: 'In the Loop',
  /** 从Latest之后取几条 */
  count: 6,
} as const;

/** 「Latest」区块 */
export const home = {
  /**
   * 展示几篇。
   * 1 篇做通栏头条，其余按 12 列网格铺开：
   *   6 篇 → 头条 1 + 两列 2 + 三列 3（刚好排满）
   *   5 篇 → 三列那行会空一格
   */
  latestCount: 6,
  /** 下面「More posts」列表取几篇 */
  moreCount: 8,
  /** 是否显示统计表 */
  showStats: true,
} as const;

// ---------------------------------------------------------------------------
// 默认封面
// ---------------------------------------------------------------------------
/**
 * 文章没写 cover 时，从下面的列表里挑一张。
 *
 * 图片放这里：src/assets/covers/
 * 只写文件名即可，例如 '01.webp'，不需要写路径。
 * 目录为空或不配置时，回退到程序生成的抽象封面（CoverArt）。
 *
 * 选择规则：用文章 id 的哈希取模，所以同一 posts每次构建都拿到同一张图，
 * 不会出现「刷新一次换一张」的情况。
 */
export const defaultCovers = {
  /** 是否启用 */
  enable: true,
  /** 图片文件名列表（相对 src/assets/covers/） */
  images: [] as string[],
} as const;

// ---------------------------------------------------------------------------
// 分类
// ---------------------------------------------------------------------------
/**
 * 分类直接来自文章 frontmatter，这里只放展示顺序与可选描述。
 * 未列出的分类会按文章数量自动排在后面。
 */
export const categoryOrder = ['Engineering', 'Design', 'Notes', 'Announcements'] as const;

export const categoryDescriptions: Record<string, string> = {
  Engineering: 'How things are built, and why.',
  Design: 'Type, spacing, colour, and the reasoning behind them.',
  Notes: 'Short observations and things worth remembering.',
  Announcements: 'Changes to this site.',
};

// ---------------------------------------------------------------------------
// 派生工具
// ---------------------------------------------------------------------------

/** 把分类名转成 URL 片段（中文分类也保持可读，浏览器会自动编码） */
export const categorySlug = (name: string) => encodeURIComponent(name);

export const categoryHref = (name: string) => `/categories/${categorySlug(name)}/`;
export const tagHref = (name: string) => `/tags/${encodeURIComponent(name)}/`;

export const categoryLabel = (name: string) => name;

/** 页脚社交链接：过滤空值，按固定顺序排列，便于稳定渲染 */
export const socialOrder = [
  'rss',
  'github',
  'twitter',
  'bluesky',
  'weibo',
  'zhihu',
  'facebook',
  'email',
] as const;

/** 把 social 对象整理成有序数组，空值自动跳过 */
export function socialLinks(): { key: string; label: string; href: string }[] {
  const labels: Record<string, string> = {
    rss: 'RSS',
    github: 'GitHub',
    twitter: 'Twitter',
    bluesky: 'Bluesky',
    weibo: 'Weibo',
    zhihu: 'Zhihu',
    facebook: 'Facebook',
    email: 'Email',
  };

  const entries = footer.social as Record<string, string>;
  const known = socialOrder.filter((key) => entries[key]?.trim());
  // 配置里出现的其他 key 也一并保留，按字母序排在后面
  const extra = Object.keys(entries)
    .filter((key) => !(socialOrder as readonly string[]).includes(key) && entries[key]?.trim())
    .sort();

  return [...known, ...extra].map((key) => ({
    key,
    label: labels[key] ?? key,
    href: entries[key],
  }));
}

/** 替换版权行里的占位符 */
export function copyrightLine(): string {
  return footer.copyright
    .replace('{year}', String(new Date().getFullYear()))
    .replace('{author}', site.author);
}

/**
 * 按导航路径查描述，用于 SEO。
 *
 * 路径写法不统一：内容 frontmatter 常写 `/about`，导航配置写 `/about/`。
 * 比较前统一去掉尾斜杠，避免因为一个斜杠查不到。
 */
export function navDescription(href: string): string | undefined {
  const norm = (p: string) => p.replace(/\/+$/, '') || '/';
  const target = norm(href);
  return site.globalNav.find((item) => norm(item.href) === target)?.description;
}

/**
 * 把 BCP 47 标签转成 Open Graph 要求的 `语言_地区` 形式。
 *
 *   en       → en_US   （没有地区时补一个默认值）
 *   zh-CN    → zh_CN
 *   pt-BR    → pt_BR
 *
 * og:locale 用的是 Facebook 的约定，必须下划线且带地区，
 * 和 <html lang> 的写法不是一回事，所以由 lang 派生而不是再配一次。
 */
export function ogLocale(lang: string = site.lang): string {
  const [base, region] = lang.split(/[-_]/);

  if (region) return `${base.toLowerCase()}_${region.toUpperCase()}`;

  // 没有地区时的默认归属
  const defaults: Record<string, string> = {
    en: 'US',
    zh: 'CN',
    ja: 'JP',
    ko: 'KR',
    pt: 'BR',
    es: 'ES',
    fr: 'FR',
    de: 'DE',
    ru: 'RU',
  };

  const fallback = defaults[base.toLowerCase()];
  return fallback ? `${base.toLowerCase()}_${fallback}` : base.toLowerCase();
}
