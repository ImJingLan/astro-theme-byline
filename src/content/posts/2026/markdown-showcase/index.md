---
title: Markdown showcase
date: 2026-04-02 10:00:00 +0000
categories: Design
tags: [markdown, typography, reference]
description: Every block element this theme styles, on one page.
draft: false
---

A reference page for checking that each Markdown element is styled. Useful
when changing the type scale or spacing.

## Headings

### Third level

#### Fourth level

##### Fifth level

###### Sixth level

## Paragraphs and inline styles

A paragraph with **bold text**, *italic text*, ***both at once***, ~~struck
text~~, and `inline code`. Links look like [this one](https://example.com) and
are the only element on the page that uses the accent colour.

Line breaks inside a paragraph are joined by the renderer. Two trailing spaces
force a break,  
like this.

## Lists

Unordered:

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

Ordered:

1. First step
2. Second step
   1. Nested step
   2. Another nested step
3. Third step

Task list:

- [x] Completed item
- [ ] Pending item

## Blockquote

> A blockquote sets text apart without a heading. It is used for pull quotes
> and for quoting a source.
>
> It can span multiple paragraphs.

## Code

Inline code, `npm run build`, sits in a subtle box.

A fenced block with a language:

```ts
type Theme = 'light' | 'dark';

function resolve(preference: Theme | 'system'): Theme {
  if (preference !== 'system') return preference;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
```

A block without a language renders as plain text:

```
plain text block
no highlighting
```

## Table

| Element | Default | Notes |
| --- | --- | --- |
| Body text | 17px | 1.8 line height |
| Headings | 32–52px | Tighter leading |
| Code | 14px | Monospace stack |
| Caption | 15px | Secondary colour |

## Horizontal rule

---

## Images

A wide figure:

![A generated gradient with three bars suggesting text](figure-wide.webp)

Two square images side by side:

![Square gradient, warm](figure-square-1.webp)

![Square gradient, cool](figure-square-2.webp)

A portrait image:

![Portrait gradient with a circle](figure-portrait.webp)

## Mixed content

A list containing a code span and a link:

- Run `bun run dev` to start the server
- Read the [Astro documentation](https://docs.astro.build)
- Check the **build output** before deploying
