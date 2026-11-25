# Byline

A quiet editorial blog theme for Astro and Tailwind CSS.

A byline is the line that names the writer. The layout borrows the rhythm of a
newsroom — a wide lead story, a grid of smaller tiles, a narrow measure for
long-form reading — without copying anyone's assets or typefaces. Everything
visual is either open source or generated at build time.

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
| Interface language, date format, `og:locale` | `src/lib/site.ts` (`lang`) |
| Interface copy | `src/i18n/<lang>.ts` |

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

### Friend links

`src/content/_data/friends.json` holds the list. Each entry decides how its
recent posts are fetched:

```json
{
  "title": "Example Blog",
  "link": "https://example.com",
  "desc": "One line about the site.",
  "avatar": "https://example.com/avatar.webp",
  "feed": "https://example.com/atom.xml",
  "mode": "build"
}
```

| `mode` | When posts are read | Trade-off |
| --- | --- | --- |
| `build` (default) | During the build, written into the HTML | Fresh only as often as the site is rebuilt; no runtime cost |
| `dynamic` | In the browser after the page loads, then every `friends.refreshMinutes` | Always current, but the feed host must send `Access-Control-Allow-Origin` |
| `none` | Never — the card shows no post list | — |

`dynamic` needs CORS. A browser cannot read a cross-origin feed that does not
opt in, and most blogs do not. When it fails the list simply stays empty; the
rest of the page is unaffected. Check a feed with:

```bash
curl -sI -H "Origin: https://your-site.com" https://example.com/atom.xml | grep -i access-control
```

The interval, retry count and timeout live in `src/lib/site.ts`:

```ts
export const friends = {
  refreshMinutes: 30,   // 0 = fetch once per page load
  retries: 1,
  timeoutMs: 8000,
};
```

### Timeline

`src/content/pages/timeline/index.md` turns the site's own posts and the
friends' posts into one stream, newest first, grouped by month:

```yaml
timeline:
  show: true
  limit: 50
  includeSelf: true
  includeFriends: true
  friendPosts: 3
  pageSize: 10
```

Only friends with `mode: build` contribute. A `dynamic` site's posts are not
fetched until the page is open in a browser, so at build time there is nothing
to place on the timeline and no date to sort by. Posts whose feed carries no
date are left out for the same reason.

Each row shows the source: this site gets a blue marker and a "This site"
badge, a friend gets its name and avatar. Links to friends open in a new tab
and carry the same `?ref=` as the friend page.

The first `pageSize` entries are written into the HTML. The rest are cut into
chunks of the same size and written as `/timeline-data/<year>-<month>.json`,
fetched one at a time when "Load more" is pressed. A month with more than
`pageSize` entries continues in `<year>-<month>.2.json`.

Chunk names come from the month, not from a running number, so publishing a
post rewrites only the chunk for that month: on the demo, adding one to June
2024 left the other four files byte-for-byte identical. A numbered scheme
would have shifted every later page.

That only helps if the deploy compares content. Astro rewrites the whole of
`dist` on every build, so every file gets a fresh mtime, and rsync's default
size-and-time check would upload all of it. Pass `-c` to compare checksums:

```yaml
ARGS: "-rltgoDzvOc --delete"
```

A row costs about 1.1 KB of markup, and the templates and button add roughly
1 KB once. Deferring entries therefore pays off as soon as more than one is
moved off the first page — on the demo, 16 entries at `pageSize: 10` come to
75.9 KB against 81.7 KB for rendering them all.


### Interface language

The interface ships in English and Chinese. A site is one language at a time;
set `site.lang` in `src/lib/site.ts` and the matching dictionary is used:

```ts
export const site = {
  lang: 'zh-CN',   // → src/i18n/zh.ts
  // ...
}
```

Dates follow the same value, via `Intl.DateTimeFormat`.

`og:locale` is derived from it rather than configured separately: Open Graph
wants `en_US`, with an underscore and a region, while `<html lang>` wants the
BCP 47 form `en-US`. Writing both by hand invites them drifting apart, so
`lang` is the only input and `ogLocale()` fills in a sensible region when you
omit one — `ja` becomes `ja_JP`, `pt-BR` stays `pt_BR`.

To add a language, copy `src/i18n/en.ts`, translate the values, and register
it in `src/i18n/index.ts`:

```ts
import { ja } from './ja';

export const dictionaries = { en, zh, ja };
```

`zh.ts` is typed as `Dictionary`, the shape of `en.ts`. Add a key to English
and forget the other file, and the build fails — you cannot ship a half
translated interface by accident.

What lives in the dictionary is interface only: headings, buttons, empty
states, aria labels. Site identity — name, nav labels, category descriptions —
stays in `src/lib/site.ts`, because that is content, not chrome.

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
| `bun run words` | Count words per post, and the total |

`bun run words` walks `src/content/posts/`, strips each file's frontmatter and
Markdown syntax, and counts Chinese characters individually while counting
Latin text by word. The total is the same number the home page shows in its
stats block, so the two can be compared when a post is edited.

## Deploying

The build is a folder of static files. Any static host works — Netlify,
Vercel, Cloudflare Pages, or a plain nginx directory.

## Licence

MIT — see [LICENSE](LICENSE). Use it, fork it, ship it, sell what you build
with it. Attribution is appreciated but not required.

The demo posts and generated artwork are placeholders; replace them with your
own. Inter and Inter Tight are bundled under the SIL Open Font License 1.1,
which permits redistribution and modification but requires the font itself to
stay under the OFL.

