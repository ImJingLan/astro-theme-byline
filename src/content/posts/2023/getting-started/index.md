---
title: Getting started
date: 2023-12-01 08:00:00 +0000
categories: Announcements
tags: ["setup", "guide"]
description: Clone, install, and have a running site in three commands.
draft: false
---

```bash
git clone <this repo> my-blog
cd my-blog
bun install && bun run dev
```

Open `http://localhost:4321`. The demo posts are in
`src/content/posts/`; delete them and add your own.

## Making it yours

1. Edit `src/lib/site.ts` — name, description, nav, social links.
2. Set `site` in `astro.config.mjs` to your domain.
3. Replace the images in `src/assets/covers/` with your own.
4. Write posts in `src/content/posts/<year>/<slug>/index.md`.

## Deploying

The output is a folder of static files. Anything that serves HTML will do.
