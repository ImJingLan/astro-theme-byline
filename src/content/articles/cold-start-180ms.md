---
title: 'How we cut cold start to 180 milliseconds'
eyebrow: 'Engineering'
description: 'A tour of the three changes that mattered, and the four that did not.'
publishedAt: 2026-11-06
category: 'engineering'
author: 'Devin Park'
coverAlt: ''
---

Cold start is the most honest performance metric we track. It is the time between a user double-clicking the icon and seeing a usable window, measured on the slowest machine in our support matrix — a five-year-old laptop with a spinning disk and 8 GB of memory.

Eighteen months ago that number was 1.4 seconds. Today it is 180 milliseconds.

## What actually helped

Three changes accounted for almost all of the improvement.

**Deferring the editor.** The text engine used to initialize before the window appeared, because the window needed a document to show. We now render a lightweight frame first and hand off to the editor once the first paint completes. Perceived start time dropped by more than half with no visible flicker.

**Replacing the plugin scan.** Startup used to enumerate every installed plugin, read its manifest, and resolve its dependencies. That work now happens lazily, per plugin, the first time it is needed.

**Precomputing the theme.** Theme resolution walked a chain of overrides at runtime. We now compile the resolved theme at build time and ship it as a single blob.

## What did not help

We spent six weeks on a custom memory allocator and measured a 4% improvement. We rewrote the router twice for no measurable gain. We tried to parallelize the remaining initialization and made it slower, because the work was dominated by a single dependency chain.

> The most useful performance work is usually the work of deleting something, not the work of making something faster.

## Measuring it honestly

Our benchmark runs on physical hardware in a lab, on a schedule, and publishes results to an internal dashboard that anyone can query. It fails the build if the 95th percentile regresses by more than 5%. Without that gate, every improvement we made would have quietly eroded within two releases.
