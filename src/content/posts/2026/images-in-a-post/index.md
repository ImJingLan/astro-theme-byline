---
title: Images in a post
date: 2026-04-04 10:00:00 +0000
categories: Design
tags: [images, layout, assets]
description: How images are stored, referenced, and optimised.
draft: false
---

Images live next to the Markdown file and are referenced by a relative path.
The build hashes them, converts them to WebP, and writes explicit width and
height so the layout does not shift while they load.

## A single image

![A wide gradient with three bars](inline-figure.webp)

The source above is `inline-figure.webp` in the same folder as this file.

## Two images in a row

![Square gradient, warm tones](square-1.webp)

![Square gradient, cool tones](square-2.webp)

## A tall image

![Portrait gradient with a circle](portrait.webp)

## An image with a caption

The theme does not add captions automatically, but a paragraph after the image
reads as one:

![A wide gradient with three bars](inline-figure.webp)

*Figure 1. A generated gradient, standing in for a photograph.*

## Image followed by text

![Square gradient, warm tones](square-1.webp)

Text continues after the image without an extra wrapper.

## Cover image

A post can declare a cover in its frontmatter, which is used for the card
thumbnail:

```yaml
---
title: My post
cover: cover.webp
---
```

Without a cover, the listing falls back to one of the images in
`src/assets/covers/`. The article page itself shows no hero image in that
case, so the title sits closer to the body.
