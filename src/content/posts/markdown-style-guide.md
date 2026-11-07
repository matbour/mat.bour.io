---
title: Markdown style guide
description: Every element the blog supports, to check typography in both themes.
date: 2026-01-01
category: tech
tags: [meta]
draft: true
---

<!-- Keep this file as a draft. It only appears with `bun run dev` and is useful whenever you change the styles. -->

This paragraph has **bold text**, _italic text_, a [link](https://mat.bour.io), and some `inline code`. Body text is set in Literata at 18px with a line length of about 68 characters, which is comfortable to read on any screen.

## A second-level heading

Lists work as you'd expect:

- Write Markdown files in `src/content/posts`
- Commit and push
- Coolify builds and deploys

Numbered lists too:

1. Edit
2. Preview with `bun run dev`
3. Ship

### A third-level heading

> A blockquote, for when you quote someone or want to set a thought apart.

```ts
// Code blocks are highlighted at build time, no JavaScript in the browser.
export function readingTime(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
```

```bash
docker build -t mat.bour.io . && docker run --rm -p 8080:80 mat.bour.io
```

| Board          | CPU     | RAM  |
| -------------- | ------- | ---- |
| Orange Pi 5    | RK3588S | 8 GB |
| Raspberry Pi 5 | BCM2712 | 8 GB |

---

That's everything.
