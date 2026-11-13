---
title: Grid and rhythm
date: 2024-06-02 13:00:00 +0000
categories: Design
tags: ["grid", "layout", "design"]
description: Why the tile grid is twelve columns, and what happens below a thousand pixels.
draft: false
---

Twelve columns divides evenly by 2, 3, 4, and 6, which covers almost
every arrangement a page like this needs. A lead story takes all twelve. Two
stories take six each. Three take four.

## Below the breakpoint

At narrow widths the grid collapses to two columns, and below 735px to one.
The interesting case is the middle: at tablet width, two columns of text with
a 16:9 image above each is still readable, but three is not.

## The gaps

Tiles are separated by a fixed gap rather than by margins on each tile. That
way the spacing is decided in one place, and a tile that spans two columns
does not carry a margin it does not need.
