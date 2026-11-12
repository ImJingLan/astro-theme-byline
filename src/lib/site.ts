// 站点级配置：改这里就能换成你自己的品牌
export const site = {
  name: 'Lumen',
  title: 'Lumen Newsroom',
  description: 'The latest news, product updates, and stories from the teams at Lumen.',
  locale: 'en-US',
  // 主站导航（对应 Apple 的 globalnav：44px 高、深色、12px 链接）
  globalNav: [
    { label: 'Newsroom', href: '/' },
    { label: 'Products', href: '/category/products/' },
    { label: 'Design', href: '/category/design/' },
    { label: 'Engineering', href: '/category/engineering/' },
    { label: 'Culture', href: '/category/culture/' },
  ],
  // 新闻编辑室子导航（对应 Apple 的 localnav）
  localNav: [
    { label: 'Latest', href: '/' },
    { label: 'Archive', href: '/news/' },
    { label: 'About', href: '/about/' },
  ],
  social: [
    { label: 'RSS', href: '/rss.xml' },
    { label: 'Mastodon', href: 'https://example.com/@lumen' },
    { label: 'GitHub', href: 'https://example.com/lumen' },
  ],
} as const;

export const categories = [
  { slug: 'products', label: 'Products', description: 'New releases, updates, and availability.' },
  { slug: 'design', label: 'Design', description: 'How we think about craft, typography, and interaction.' },
  { slug: 'engineering', label: 'Engineering', description: 'Deep dives from the people building the platform.' },
  { slug: 'culture', label: 'Culture', description: 'People, programs, and the work behind the work.' },
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];

export const categoryLabel = (slug: string) =>
  categories.find((c) => c.slug === slug)?.label ?? slug;
