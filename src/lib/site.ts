/**
 * 站点配置。改这里就能换成自己的站点，不需要动组件。
 * 下面全是演示值。
 */

export const site = {
  /** 站点名，显示在导航栏与页脚 */
  name: 'Example Blog',
  /** 完整标题，用于 <title> 与 RSS */
  title: 'Example Blog',
  /** 一句话副标题 */
  subtitle: 'A quiet editorial blog theme for Astro',
  /** SEO 描述 */
  description:
    'A quiet editorial blog theme for Astro and Tailwind CSS, with a newsroom-style layout.',
  /** SEO 关键词，逗号分隔 */
  keywords: 'example,blog,astro,tailwind,theme',
  /** 站点地址，用于 canonical 与 RSS，末尾不带斜杠 */
  url: 'https://example.com',
  /**
   * 站点语言，BCP 47 标签（en / zh-CN / ja）。
   * 决定 <html lang>、界面字典、日期格式，以及 og:locale（自动转下划线形式）。
   */
  lang: 'en',
  /** 作者名，用于 byline 与版权 */
  author: 'Example Author',
  /** 时区，影响日期格式化 */
  timezone: 'UTC',

  /** 导航栏图标；留空显示内置方块占位 */
  logo: '',
  /** 浏览器标签页图标；留空用内置的 /favicon.svg */
  favicon: '',

  /** 首页顶部的自我介绍 */
  intro: {
    eyebrow: 'Byline',
    heading: 'Stories worth keeping.',
    lead: 'A demo blog built with this theme. Replace these posts with your own.',
  },

  /** 导航栏。description 只用于 SEO，不影响显示 */
  globalNav: [
    { label: 'Home', href: '/', description: 'The latest posts and site statistics.' },
    { label: 'Archive', href: '/archive/', description: 'Every post, newest first, grouped by month.' },
    { label: 'Tags', href: '/tags/', description: 'Browse posts by topic.' },
    { label: 'Friends', href: '/friends/', description: 'Other blogs worth reading.' },
    { label: 'About', href: '/about/', description: 'About this site and the theme behind it.' },
  ],
} as const;

export const footer = {
  /** key 决定图标；留空字符串的条目不显示 */
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

  /** 版权行，{year} 与 {author} 会被替换 */
  copyright: 'Copyright © {year} {author}. All rights reserved.',
  /** 右下角构建说明；留空不显示 */
  credit: 'Built with Astro & Tailwind CSS',
} as const;

export const ogImage = {
  /** 是否输出站点默认分享图（需自备 public/og-default.png） */
  enable: false,
  bgColor: '#eaecf0',
  fontColor: '#1e1e1e',
  authorColor: '#444444',
} as const;

export const pagination = {
  /** 归档页每页几篇 */
  archivePerPage: 6,
  /** 标签 / 分类详情页每页几篇 */
  taxonomyPerPage: 12,
} as const;

/** In the Loop 画廊 */
export const gallery = {
  /** 整块开关 */
  enable: true,
  showArrows: true,
  showDots: true,
  /** 'head' 与标题同行靠右；'overlay' 悬浮在卡片两侧 */
  arrowPlacement: 'head' as 'head' | 'overlay',
  title: 'In the Loop',
  /** 从最新文章之后取几条 */
  count: 6,
} as const;

/** 首页最新文章区块 */
export const home = {
  /**
   * 展示几篇。头条 1 篇 + 其余按 12 列网格铺开，
   * 6 篇刚好排满，5 篇会在三列那行空一格。
   */
  latestCount: 6,
  /** 下面「更多文章」列表取几篇 */
  moreCount: 8,
  /** 是否显示统计表 */
  showStats: true,
} as const;

/**
 * 文章没写 cover 时的备选图。
 *
 * 图片放 src/assets/covers/，这里只写文件名。
 * 按文章 id 哈希取模，同一篇文章每次构建都拿到同一张。
 * 目录为空时回退到程序生成的抽象封面。
 */
export const defaultCovers = {
  enable: true,
  images: [] as string[],
} as const;

/** 分类展示顺序；未列出的按文章数量排在后面 */
export const categoryOrder = ['Engineering', 'Design', 'Notes', 'Announcements'] as const;

export const categoryDescriptions: Record<string, string> = {
  Engineering: 'How things are built, and why.',
  Design: 'Type, spacing, colour, and the reasoning behind them.',
  Notes: 'Short observations and things worth remembering.',
  Announcements: 'Changes to this site.',
};

export const categorySlug = (name: string) => encodeURIComponent(name);

export const categoryHref = (name: string) => `/categories/${categorySlug(name)}/`;
export const tagHref = (name: string) => `/tags/${encodeURIComponent(name)}/`;

export const categoryLabel = (name: string) => name;

/** 社交链接的固定顺序，让页脚渲染稳定 */
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

/** 把 social 对象整理成有序数组，跳过空值 */
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
  // 配置里的其它 key 也保留，按字母序排在后面
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
 * 按路径查导航描述。
 * frontmatter 常写 `/about`，配置写 `/about/`，比较前统一去掉尾斜杠。
 */
export function navDescription(href: string): string | undefined {
  const norm = (p: string) => p.replace(/\/+$/, '') || '/';
  const target = norm(href);
  return site.globalNav.find((item) => norm(item.href) === target)?.description;
}

/**
 * BCP 47 标签 → Open Graph 的 `语言_地区` 形式。
 * og:locale 要求下划线且带地区，和 <html lang> 写法不同，所以由 lang 派生。
 */
export function ogLocale(lang: string = site.lang): string {
  const [base, region] = lang.split(/[-_]/);

  if (region) return `${base.toLowerCase()}_${region.toUpperCase()}`;

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
