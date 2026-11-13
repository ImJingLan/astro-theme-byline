---
title: Swapping pages without a reload
date: 2026-02-19 10:20:00 +0000
categories: Engineering
tags: ["astro", "swup", "animation"]
description: What a client-side router does, and the three things that break when you add one.
draft: false
---

Navigation in a static site normally means fetching and parsing a
whole document again. A router fetches the next page, takes one element out of
it, and swaps that in place. The nav, the footer, and their state survive.

## The animation

The router adds class names to `<html>` as it goes: `is-changing` when a visit
starts, `is-rendering` once the new content is in. CSS watches those names and
does the rest.

```css
html.is-rendering.is-animating main {
  opacity: 0;
  translate: 0 10px;
}
```

Leaving finishes in a millisecond; entering takes 300ms. A slow exit is what
makes a transition feel sluggish.

## Three things that break

**Scripts do not re-run.** The module executed once, on first load. Anything
that binds to the DOM has to listen for the router's page-load event and guard
against double binding.

**Scroll position is lost.** The browser restores scroll on a real navigation;
it does not on a swap. Save the position per path and restore it on back.

**The active nav item goes stale.** The nav is outside the swapped element, so
it is never re-rendered.
