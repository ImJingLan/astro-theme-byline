---
title: 'A color system with eleven greys and one blue'
eyebrow: 'Design'
description: 'Why we deleted 60% of our palette, and the rules that replaced it.'
publishedAt: 2026-10-29
category: 'design'
author: 'Mara Ellison'
coverAlt: ''
---

Our palette had 94 colors. Most of them existed because someone needed a slightly different grey on a Tuesday and nobody was watching the tokens file.

We now have twelve colors: eleven greys and one blue.

## The greys are a scale, not a collection

Each grey has a job, and the job is described by how it is used rather than by how it looks.

- **Ink** — body copy and headlines. One value, used for both.
- **Graphite** — timestamps, eyebrows, and secondary labels.
- **Slate** — captions and legal text, the quietest readable level.
- **Hairline** — dividers and borders, never text.
- **Fog and Chip** — section backgrounds and pill buttons.
- **Canvas and Night** — the two surfaces everything sits on.

Anything that does not fit one of those descriptions does not get a token. If a new component seems to need a new grey, that is usually a signal that the component is solving the wrong problem.

## One blue, used sparingly

Links are blue. That is the entire accent system. Buttons are neutral, chips are grey, and the primary call to action is a filled dark pill rather than a colored one.

This felt austere for about a week. What it buys is enormous: because blue appears only where something is genuinely interactive, users learn the rule in one page view and never have to guess.

## Enforcing it

Tokens live in one file. A build-time check fails if a component references a raw hex value instead of a token. The check took an afternoon to write and has caught every regression since.
