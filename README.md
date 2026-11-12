# 博客主题 · Astro + Tailwind CSS

一套编辑式排版的个人博客主题：980px 编辑主栏、12 列磁贴网格、
克制的留白与层级、全站唯一一个蓝色留给链接。

**内容直接兼容 Hexo / Hugo**：把 Markdown 丢进 `src/content/posts/` 就能用，
不用改一行 frontmatter。

字体使用开源 Inter / Inter Tight 搭配系统中文字体，配图可由主题程序化生成，
不包含任何第三方图片、图标或品牌资产。

---

## 技术栈

| 部分   | 选择                                         |
| ------ | -------------------------------------------- |
| 框架   | Astro 7（静态输出）                          |
| 样式   | Tailwind CSS 4（`@tailwindcss/vite`）        |
| 字体   | Inter Variable + Inter Tight Variable（OFL） |
| 包管理 | Bun，使用 npmmirror 镜像                     |
| 内容   | `astro:content` + Markdown                   |

## 开始使用

```bash
bun install --registry=https://registry.npmmirror.com
bun run dev        # http://localhost:4321
bun run build      # 输出到 dist/
bun run preview
```

`dev` / `build` 前会自动执行 `scripts/sync-assets.mjs`，把博文配图同步到 `public/content/`。

## 放入你的博客

把文章按原来的目录结构放到 `src/content/posts/`：

```
src/content/posts/
├── 2026/
│   └── rp2350-passkey/
│       ├── index.md          ← 文章
│       ├── rp2350-passkey-1.webp
│       └── tutorial/
│           └── passkey-1.webp
└── 2022/
    └── hello-world/
        └── index.md
```

- 文章 URL 保留目录结构：`/posts/2026/rp2350-passkey/`
- 文章内的相对图片路径（`![](rp2350-passkey-1.webp)`、`![](tutorial/passkey-1.webp)`）
  会被自动解析并交给 Astro 优化，**不需要改任何路径**
- 独立页面放到 `src/content/pages/`，例如 `about/index.md` 会渲染到 `/about/`

### Frontmatter

```yaml
---
title: "40 元自制开源版 Yubikey"
date: "2026-07-03T17:55:00.000Z"
description: "摘要，也可以写成 excerpt 或 summary"
tags:
  - "安全密钥"
  - "RP2350"
categories:
  - "技术"
---
```

支持字段（大部分可选，缺省也能跑）：

| 字段                                | 说明                        |
| ----------------------------------- | --------------------------- |
| `title`                             | 必填                        |
| `date`                              | 必填，可被 `z.coerce.date()` 解析 |
| `updated`                           | 最后更新时间                |
| `description` / `excerpt` / `summary` | 摘要，三者取其一            |
| `categories` / `category`           | 字符串或数组                |
| `tags`                              | 字符串或数组                |
| `cover` / `banner` / `image`        | 头图与缩略图路径            |
| `author`                            | 作者，缺省用 `site.author`  |
| `sticky`                            | 数字越大越靠前              |
| `draft`                             | `true` 则不构建             |

## 站点配置

`src/lib/site.ts`：

- `site`：标题、描述、作者、首页自我介绍、导航、社交链接
- `gallery`：画廊标题、数量、是否显示箭头/圆点、箭头位置
- `categoryOrder` / `categoryDescriptions`：分类展示顺序与文案

## 图片路径解析

`src/lib/assets.ts` 负责把博文里的相对路径映射到构建产物：

1. 相对文章目录（`2026/rp2350-passkey/a.webp`）
2. 相对文章目录的上一级（图片放在年份目录里也能找到）
3. 相对 `src/content/`

替换发生在 **Markdown 编译之前**——因为 Astro 会把渲染出的 `<img>` 变成
`__ASTRO_IMAGE_` 占位符，编译之后再改 HTML 就改不到了。

## 路由

| 路由                    | 页面                                                 |
| ----------------------- | ---------------------------------------------------- |
| `/`                     | 最新文章磁贴 + 画廊 + 更多文章 + 分类                |
| `/posts/[...slug]/`     | 文章详情（面包屑、标签、阅读时长、相关文章、分享）   |
| `/archive/`             | 按年份分组的全部文章                                 |
| `/categories/`          | 分类总览                                             |
| `/categories/[name]/`   | 单个分类                                             |
| `/tags/`                | 标签总览                                             |
| `/tags/[name]/`         | 单个标签                                             |
| `/about/`               | 来自 `content/pages/about/index.md`                  |
| `/rss.xml`              | RSS                                                  |
| `/404`                  | 未找到                                               |

## 设计令牌

全部在 `src/styles/global.css` 的 `@theme` 里。色板刻意做小——十一种灰 + 一个蓝：

| 令牌               | 值        | 用途                                                  |
| ------------------ | --------- | ----------------------------------------------------- |
| `--color-ink`      | `#1d1d1f` | 正文与标题                                            |
| `--color-graphite` | `#5f5f66` | 时间、分类、次级文本（白底与冷灰底均达 AA）           |
| `--color-slate`    | `#6e6e73` | 图注、元信息                                          |
| `--color-fog`      | `#f5f5f7` | 分区背景                                              |
| `--color-chip`     | `#e8e8ed` | 药丸按钮                                              |
| `--color-hairline` | `#d2d2d7` | 分隔线                                                |
| `--color-link`     | `#0066cc` | 链接，别无他用                                        |

中文排版：正文 `17px / 1.8`，字距 `0.01em`（不套用西文负字距），
段落间距 `1.15em`，H1 桌面 42px、手机 30px。

## 网格

首屏磁贴使用 12 列网格，按位置排布，写文章时不用关心跨列：

```
第 1 篇  →  1 / -1       通栏头条
第 2 篇  →  1 / span 6
第 3 篇  →  7 / span 6
第 4 篇  →  1 / span 4
第 5 篇  →  5 / span 4
第 6 篇  →  9 / span 4
第 7 篇+ →  span 4（继续三列节奏）
```

断点：`≥1069px` 按上表；`735–1068px` 全部两列；`≤734px` 单列。

## 画廊

`<Gallery />` 左右箭头每次翻一页，两端自动禁用，与圆点、手动滚动、键盘方向键联动。
圆点在运行时按「可达的滚动停靠点」生成——页数取决于视口宽度（桌面 5 页、手机 6 页），
构建时无法预知，这样才不会出现永远点不亮的指示器。

## 版权说明

- **字体**：Inter / Inter Tight 采用 SIL Open Font License 1.1，经 Fontsource 本地打包，
  站点不发起任何第三方字体请求。
- **配图**：`src/components/CoverArt.astro` 用文章 id 的哈希生成确定性 SVG，
  不下载、不派生任何第三方图像。
- **你的内容**：`src/content/posts/` 与 `src/content/pages/` 已在 `.gitignore` 中排除，
  不会被提交到本仓库。

使用时把 `site.name`、`site.title` 和首页自我介绍换成你自己的即可。
