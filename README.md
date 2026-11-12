# Lumen Newsroom — an editorial blog theme

An Astro + Tailwind CSS blog theme that borrows the **layout language** of a modern
corporate newsroom: a 980px editorial column, a 12-column tile grid, oversized headlines,
generous whitespace, and exactly one accent color reserved for links.

**Nothing is copied from any existing site.** No proprietary fonts, no photography, no logos,
no brand assets. All imagery is generated procedurally in SVG at build time, and both typefaces
are open source.

---

## Stack

| Piece      | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | Astro 7 (static output, Rust compiler)        |
| Styling    | Tailwind CSS 4 via `@tailwindcss/vite`        |
| Type       | Inter Variable + Inter Tight Variable (OFL)   |
| Package mgr| Bun, with the npmmirror registry              |
| Content    | Markdown content collection (`astro:content`) |

## Getting started

```bash
bun install --registry=https://registry.npmmirror.com
bun run dev        # http://localhost:4321
bun run build      # static output in dist/
bun run preview
```

## Design tokens

Everything visual lives in `src/styles/global.css` under `@theme`. The palette is deliberately
small — eleven greys and one blue:

| Token            | Value     | Job                              |
| ---------------- | --------- | -------------------------------- |
| `--color-ink`    | `#1d1d1f` | Body copy and headlines          |
| `--color-graphite` | `#5f5f66` | Timestamps, eyebrows, secondary text (AA on white and on fog) |
| `--color-slate`  | `#6e6e73` | Captions and legal text          |
| `--color-fog`    | `#f5f5f7` | Section backgrounds              |
| `--color-chip`   | `#e8e8ed` | Pill buttons                     |
| `--color-hairline` | `#d2d2d7` | Dividers                        |
| `--color-link`   | `#0066cc` | Links, and nothing else          |

Type scale: `17px / 1.47` body, `32px / 1.125` section heads, `48px` article titles,
`24px` in-article `h2`, `12px` captions.

## The tile grid

The home page uses a 12-column grid with position-based placement, so editors never have to
think about spans — they just add articles:

```
item 1  →  columns 1 / -1   (full-width hero)
item 2  →  columns 1 / span 6
item 3  →  columns 7 / span 6
item 4  →  columns 1 / span 4
item 5  →  columns 5 / span 4
item 6  →  columns 9 / span 4
item 7+ →  span 4 (continues the three-up rhythm)
```

Breakpoints:

- **1069px and up** — the layout above, 36px gutters, 32px tile radius.
- **735–1068px** — everything becomes two columns, 24px gutters, 24px radius, and the hero
  downgrades from a side-by-side split to a stacked card.
- **734px and below** — single column stack.

## Content model

Articles are Markdown files in `src/content/articles`. Frontmatter:

```yaml
---
title: 'Introducing Lumen Studio'
eyebrow: 'Product'          # the small label above the headline
description: 'One-line summary, also used for meta description and cards.'
publishedAt: 2026-11-10
category: 'products'        # products | design | engineering | culture
author: 'Lumen Newsroom'
coverAlt: ''                # optional alt text when you supply a cover image
featured: false
draft: false
---
```

Drop an image into `src/assets` and reference it with `cover:` if you want real photography;
otherwise the theme generates deterministic abstract SVG artwork from the article slug.

## Gallery options

The **In the Loop** carousel is configured in `src/lib/site.ts` — no component edits needed:

```ts
export const gallery = {
  showArrows: true, // prev / next paging arrows
  showDots: true, // dot navigation below the track
  arrowPlacement: 'head' as 'head' | 'overlay',
} as const;
```

| Option           | Values                 | Effect                                                                                                         |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| `showArrows`     | `true` / `false`       | Renders the two paging buttons. When `false`, nothing is emitted — the track stays scrollable.                  |
| `showDots`       | `true` / `false`       | Renders the dot row.                                                                                           |
| `arrowPlacement` | `'head'` / `'overlay'` | `head` puts arrows on the title row, right-aligned. `overlay` floats them over the cards, vertically centered. |

The arrows page one card at a time, disable themselves at either end, and stay in sync with the
dots and with manual scrolling. Left/Right arrow keys also page when the track has focus. If the
track has no overflow, the arrow group hides itself entirely.

`<Gallery />` also accepts per-instance overrides (`showArrows`, `showDots`, `arrowPlacement`,
`title`, `viewAllHref`) if you need a second carousel with different behavior.

## Routes

| Route                  | Page                                                  |
| ---------------------- | ----------------------------------------------------- |
| `/`                    | Hero tile, 2-up and 3-up grid, gallery, link list     |
| `/news/`               | Archive grouped by month                              |
| `/news/[slug]/`        | Article: narrow column, wide hero, related stories    |
| `/category/[slug]/`    | One page per category                                 |
| `/about/`              | Long-form prose demo                                  |
| `/rss.xml`             | Full feed                                             |
| `/404`                 | Not found                                             |

## Licensing notes

- **Typefaces** — Inter and Inter Tight are licensed under the SIL Open Font License 1.1 and are
  bundled locally through Fontsource, so the site makes no third-party font requests.
- **Imagery** — `src/components/CoverArt.astro` draws every cover in SVG from a hash of the
  article slug. Nothing is fetched, and nothing is derived from third-party artwork.
- **Layout inspiration** — the grid rhythm, type scale, and restraint are inspired by the
  editorial conventions of corporate newsrooms. Layout patterns are not copyrightable, and no
  code, copy, imagery, or brand asset from any such site is included here.

If you adapt this theme, replace the `Lumen` name, copy, and sample articles with your own.
