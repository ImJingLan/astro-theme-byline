/** 站点配置 */

export const site = {
  /** 站点名 */
  name: 'Byline',
  /** 完整标题 */
  title: 'Byline',
  subtitle: 'A quiet editorial blog theme for Astro',
  description:
    'Byline is a quiet editorial blog theme for Astro and Tailwind CSS, with a newsroom-style layout.',
  /** 关键词，逗号分隔 */
  keywords: 'example,blog,astro,tailwind,theme',
  /** 站点地址，末尾不带斜杠 */
  url: 'https://example.com',
  /** 站点语言，BCP 47 标签 */
  lang: 'en',
  /** 作者名 */
  author: 'Example Author',
  /** 时区 */
  timezone: 'UTC',

  /** 导航栏图标 */
  logo: '',
  /** 浏览器图标 */
  favicon: '',

  /** 首页自我介绍 */
  intro: {
    eyebrow: 'Byline',
    heading: 'Stories worth keeping.',
    lead: 'A demo blog built with this theme. Replace these posts with your own.',
  },

  /** 导航栏；description 仅用于 SEO */
  globalNav: [
    { label: 'Home', href: '/', description: 'The latest posts and site statistics.' },
    { label: 'Archive', href: '/archive/', description: 'Every post, newest first, grouped by month.' },
    { label: 'Tags', href: '/tags/', description: 'Browse posts by topic.' },
    { label: 'Friends', href: '/friends/', description: 'Other blogs worth reading.' },
    { label: 'About', href: '/about/', description: 'About this site and the theme behind it.' },
  ],
} as const;

export const footer = {
  /** key 决定图标，空值不显示 */
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

  /** 备案信息 */
  icp: {
    enable: false,
    url: 'https://beian.miit.gov.cn',
    text: '',
  },

  /** 版权行 */
  copyright: 'Copyright © {year} {author}. All rights reserved.',
  /** 构建说明 */
  credit: 'Built with Astro & Tailwind CSS',
} as const;

export const ogImage = {
  /** 输出默认分享图 */
  enable: false,
  bgColor: '#eaecf0',
  fontColor: '#1e1e1e',
  authorColor: '#444444',
} as const;

export const pagination = {
  /** 归档每页篇数 */
  archivePerPage: 6,
  /** 详情页每页篇数 */
  taxonomyPerPage: 12,
} as const;

/** 画廊 */
export const gallery = {
  enable: true,
  showArrows: true,
  showDots: true,
  /** 箭头位置 */
  arrowPlacement: 'head' as 'head' | 'overlay',
  title: 'In the Loop',
  /** 取几条 */
  count: 6,
} as const;

/** 最新文章 */
export const home = {
  /** 展示篇数 */
  latestCount: 6,
  /** 更多文章篇数 */
  moreCount: 8,
  /** 显示统计表 */
  showStats: true,
} as const;

/** 默认封面：图片放 src/assets/covers/ */
export const defaultCovers = {
  enable: true,
  images: [] as string[],
} as const;

/** 分类展示顺序 */
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

/** 社交链接顺序 */
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

/** 整理成有序数组，跳过空值 */
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
  // 其余 key 按字母序追加
  const extra = Object.keys(entries)
    .filter((key) => !(socialOrder as readonly string[]).includes(key) && entries[key]?.trim())
    .sort();

  return [...known, ...extra].map((key) => ({
    key,
    label: labels[key] ?? key,
    href: entries[key],
  }));
}

/** 替换版权占位符 */
export function copyrightLine(): string {
  return footer.copyright
    .replace('{year}', String(new Date().getFullYear()))
    .replace('{author}', site.author);
}

/** 按路径查导航描述，忽略尾斜杠 */
export function navDescription(href: string): string | undefined {
  const norm = (p: string) => p.replace(/\/+$/, '') || '/';
  const target = norm(href);
  return site.globalNav.find((item) => norm(item.href) === target)?.description;
}

/** BCP 47 → og:locale（语言_地区） */
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
