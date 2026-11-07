---
title: How this blog is hosted
description: A static Astro site, built in Docker and deployed by Coolify to an Orange Pi at home.
date: 2026-11-07
category: side-projects
tags: [self-hosting, astro, coolify, docker]
draft: true
---

<!--
  First draft. The structure and technical parts are written; the TODOs are
  things only you know. Delete this comment when you're done and set draft: false.
-->

This blog runs on a small single-board computer at home. Here is the whole setup, from a Markdown file on my laptop to a page on your screen.

## Why self-host a blog

_TODO: your reason. Learning, owning your content, having a use for the Pi, or just because it's fun. One honest paragraph is enough._

## The hardware

_TODO: which Orange Pi (model, RAM, storage), where it sits, what else runs on it._

## Writing

Every post is a Markdown file in a Git repository. The front matter holds the metadata:

```markdown
---
title: How this blog is hosted
date: 2026-11-07
category: side-projects
tags: [self-hosting, astro]
draft: true
---
```

[Astro](https://astro.build) checks that front matter against a schema at build time, so a typo in a date or a category fails the build instead of quietly publishing a broken page.

## Building

Astro turns the Markdown into plain HTML and CSS. Pages ship no JavaScript except the few lines behind the theme toggle. The build runs in a two-stage Docker image: [Bun](https://bun.sh) builds the site, and only the output is copied into a [Caddy](https://caddyserver.com) image.

```dockerfile
FROM oven/bun:1.4-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun --bun run build

FROM caddy:2.11-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
```

The final image holds nothing but Caddy and the HTML, and Caddy uses very little memory while it waits for requests, which matters on a board with limited RAM. The core of the server configuration is a few lines:

```text
:80 {
	root * /srv
	encode zstd gzip
	header /_astro/* Cache-Control "public, max-age=31536000, immutable"
	file_server
}
```

## Deploying

[Coolify](https://coolify.io) runs on the Pi and watches the repository. Pushing to `main` triggers a build of the Dockerfile on the Pi itself, then a container swap.

Visitors never connect to my home network directly. A [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) opens an outbound connection from the Pi to Cloudflare, which handles HTTPS and forwards requests through it to Coolify's proxy, then to the Caddy container. There are no open ports on my router, and my home IP address stays private.

_TODO: why you chose a tunnel over port forwarding, and anything that tripped you up while setting it up._

## What I'd change

_TODO: anything that was harder than expected, or that you'd do differently._
