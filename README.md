# Newsroom Theme

A quiet editorial blog theme for Astro and Tailwind CSS.

The layout borrows the rhythm of a newsroom — a wide lead story, a grid of
smaller tiles, a narrow measure for long-form reading — without copying
anyone's assets or typefaces. Everything visual is either open source or
generated at build time.

- **Fonts** — Inter and Inter Tight, bundled locally under the SIL Open Font
  License. No commercial typefaces.
- **Artwork** — abstract SVG covers drawn from a hash of each post's title, plus
  a small set of gradient images for posts that declare no cover.
- **No third-party requests** — fonts, icons and images are all served from
  your own domain.

## Requirements

- Bun 1.2+ (or npm/pnpm — only the lockfile differs)
- Node 20+

## Getting started

```bash
bun install
bun run dev
```

Open `http://localhost:4321`. The demo posts live in `src/content/posts/`;
delete them and add your own.

## Making it yours

| What | Where |
| --- | --- |
| Site name, description, nav, social links, footer | `src/lib/site.ts` |
| Domain used for canonical URLs and RSS | `astro.config.mjs` (`site`) |
| Colours, spacing, type | `src/styles/global.css` (`@theme` block) |
| Default cover images | `src/assets/covers/` |
| Friend links | `src/content/_data/friends.json` |

### Writing a post

A post is a folder. The folder path becomes the URL:

```
src/content/posts/2026/my-post/
├── index.md
├── cover.webp        ← optional, used as the card thumbnail
└── diagram.webp      ← referenced from the Markdown by relative path
```

→ served at `/2026/my-post/`

Frontmatter:

```yaml
---
title: My post
date: 2026-03-18 09:00:00 +0000
categories: Engineering        # one category, drives the eyebrow on cards
tags: [astro, css]
description: One line, used for SEO and the RSS item.
draft: false
---
```

Images referenced with a relative path (`![](diagram.webp)`) are resolved
against the post folder, hashed, converted to WebP, and given explicit
dimensions so the layout does not shift while they load.

### Keeping your posts out of the repo

If you fork this theme and want to keep writing in place without committing
your content, uncomment these lines in `.gitignore`:

```
src/content/posts/
src/content/pages/
src/content/_data/
```

The demo content that ships with the repo stays tracked; anything you add
after uncommenting is ignored.

## What is included

- **Home** — lead tile, 12-column tile grid, a carousel, a list of recent
  posts, a stats ledger, and category chips
- **Archive** — grouped by month, paginated, with every page number shown
- **Taxonomy** — tag and category indexes, both generated from frontmatter
- **Post** — hero image (only when `cover` is set), breadcrumb, reading time,
  share row, related posts
- **Pages** — a catch-all that renders anything in `src/content/pages/`
- **Themes** — light and dark, with a circular reveal and the choice remembered
- **Transitions** — pages swap without a full reload (swup)
- **Feeds** — RSS at `/rss.xml`

## Commands

| Command | Does |
| --- | --- |
| `bun run dev` | Dev server with HMR |
| `bun run build` | Static build into `dist/` |
| `bun run preview` | Serve the built output |

## Deploying

The build is a folder of static files. Any static host works — Netlify,
Vercel, Cloudflare Pages, or a plain nginx directory.

## Licence

Theme code: MIT. The demo posts and generated artwork are yours to replace.
Inter and Inter Tight are used under the SIL Open Font License 1.1.
