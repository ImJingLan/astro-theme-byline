---
title: How a post becomes a page
date: 2026-03-05 11:15:00 +0000
categories: Engineering
tags: ["astro", "build", "content"]
description: From a folder of Markdown to a hashed asset in the output directory.
draft: false
---

A post lives in its own folder:

```
src/content/posts/2026/build-pipeline/
├── index.md
├── cover.webp
└── diagram.webp
```

The folder name becomes the URL: `/2026/build-pipeline/`. Images referenced
from the Markdown are resolved relative to that folder, so `![](diagram.webp)`
just works.

## What the build does

Astro reads the frontmatter, validates it against the schema in
`src/content.config.ts`, and renders the body. Images go through the asset
pipeline: hashed, converted to WebP, and given explicit width and height so
the layout does not shift while they load.

## Static files that are not images

Some posts ship a PDF or a zip next to the Markdown. A small Vite plugin maps
those files to their natural path in the output, so a link to `slides.pdf`
resolves without any extra configuration.
