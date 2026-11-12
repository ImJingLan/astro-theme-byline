---
title: 'Designing type that stays quiet at 17 pixels'
eyebrow: 'Design'
description: 'Why our interface scale starts at 17px, and what happened when we tried to make it smaller.'
publishedAt: 2026-11-08
category: 'design'
author: 'Mara Ellison'
coverAlt: ''
---

Every interface has a resting size — the size at which most of its text is set. Ours is 17 pixels. That number is not arbitrary, but it is also not universal, and the argument for it took us three years to settle.

## The smallest honest size

At 15 pixels, a line of text on a high-density display looks fine in a mockup and tiring after twenty minutes. At 16 pixels it becomes legible but still slightly cramped when a line runs past seventy characters. At 17 pixels, with a line height of 1.47, the rhythm finally holds.

We tested this with readers rather than designers. Participants read a long article at each size and rated their fatigue afterwards. The difference between 16 and 17 was small but consistent, and it showed up in reading speed as well as preference.

## Letter spacing is not decoration

Large type needs tighter tracking; small type needs looser. We express that as a single curve rather than a set of per-component overrides:

- **Display sizes (24px and up):** slightly positive tracking, so headlines feel engineered rather than squeezed.
- **Body sizes (17px):** a mild negative value, about −0.022em.
- **Caption sizes (12px):** positive again, to keep small text from collapsing.

Keeping this in one place means a new component inherits correct typography by default, instead of accumulating hand-tuned values.

## Weight, not color, for hierarchy

Our first instinct was to separate levels with color. Grey for secondary text, darker grey for tertiary. The result was a page that felt washed out and slightly sad.

We now build hierarchy with weight and size first, and reserve color for genuinely secondary information: timestamps, captions, metadata. Body text and headlines share the same near-black. The page reads as one voice speaking at different volumes rather than several voices competing.

## What we would do differently

We would ship the type scale as tokens on day one. Most of the inconsistency in our early builds came from three teams each inventing their own line heights for the same size.
