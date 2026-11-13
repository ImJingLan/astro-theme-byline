# Contributing

Issues and pull requests are welcome. A few notes so changes land smoothly.

## Before you open a PR

Run the build — it is the only check this project has:

```bash
bun install
bun run build
```

If it builds, it is very likely fine. There is no test suite.

## What this theme is

A blog theme, not a framework. It favours:

- **Few dependencies** — currently seven runtime packages. A new dependency
  needs to earn its place.
- **No third-party requests** — fonts, icons and images are all served from
  your own domain. Do not add a CDN font or an embedded widget.
- **No commercial assets** — everything visual is either open source or drawn
  at build time. Do not add artwork you do not have the rights to.
- **One file per concern** — `src/lib/site.ts` holds the settings, the
  dictionaries hold the copy, the components hold the markup.

## Commits

Conventional Commits, one concern per commit:

```
feat(nav): open a full-screen menu on narrow screens
fix(post): space the byline separator away from the author
docs: explain how the interface language is selected
```

The changelog generator reads these prefixes, so a `feat:` shows up under
"New" and a `chore:` is skipped.

## Comments

Say what the code does, in one line, when the name does not already make it
obvious. Skip the narration of how you got there.

## Demo content

`src/content/` holds placeholder posts so the theme renders on a fresh clone.
Keep it generic — no real names, real sites, or personal details.
