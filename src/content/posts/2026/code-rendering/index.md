---
title: Code rendering
date: 2026-04-03 10:00:00 +0000
categories: Engineering
tags: [code, syntax, shiki]
description: How fenced blocks, highlighting, and long lines behave.
draft: false
---

Code blocks are a core part of a technical blog, so they get their own page.

## A single block

```ts
export function greet(name: string): string {
  return `Hello, ${name}`;
}
```

## Several languages in one page

JavaScript:

```js
const posts = await getCollection('posts');
const published = posts.filter((post) => !post.data.draft);
```

Python:

```python
def reading_time(text: str, per_minute: int = 350) -> int:
    return max(1, round(len(text) / per_minute))
```

Bash:

```bash
bun install
bun run build
bun run preview
```

CSS:

```css
.tile {
  border-radius: 32px;
  background-color: var(--color-canvas);
  transition: transform 0.4s cubic-bezier(0.28, 0.11, 0.32, 1);
}
```

Rust:

```rust
fn main() {
    let posts: Vec<&str> = vec!["one", "two", "three"];
    for (i, post) in posts.iter().enumerate() {
        println!("{i}: {post}");
    }
}
```

## Long lines

A block wider than the column scrolls horizontally rather than wrapping:

```ts
const veryLongLine = 'This line is intentionally longer than the reading column so that the horizontal scroll behaviour can be checked in both light and dark mode without wrapping the code and breaking the visual rhythm of the block';
```

## Inline code

A sentence with `aVariable`, `someFunction()`, and `--color-canvas` inline.

## Code inside lists

1. Install the dependency:
   ```bash
   bun add @swup/astro
   ```
2. Register it:
   ```js
   swup({ containers: ['main'], cache: true })
   ```
3. Build and check the output.

## Code inside blockquotes

> The original advice was:
>
> ```bash
> rm -rf node_modules && bun install
> ```
>
> which fixes most dependency problems.

## No language

A block without a language tag gets the same background and no token colours:

```
plain text
  indented
    further
```
