---
title: Dark mode without a second stylesheet
date: 2026-02-26 16:45:00 +0000
categories: Engineering
tags: ["css", "dark-mode", "design"]
description: One set of tokens, two values each, and a single attribute to switch between them.
draft: false
---

The whole palette is a set of custom properties. Dark mode does not
duplicate any rules; it overrides the tokens:

```css
html[data-theme='dark'] {
  --color-canvas: #1c1c1e;
  --color-ink: #f5f5f7;
  --color-link: #4d9fff;
}
```

Every component reads from those properties, so none of them knows which
theme is active.

## The part that catches people out

Some surfaces are dark in light mode and light in dark mode. A code block, for
example. If you pair a token like `--color-night` with a hard-coded white
foreground, the two flip independently and you end up with white on white.
Background and foreground have to be a pair of tokens that always move
together.

## Switching

The toggle writes one attribute and stores the choice. A small inline script
in `<head>` applies it before first paint, so a dark-mode reader never sees a
white flash on load.
