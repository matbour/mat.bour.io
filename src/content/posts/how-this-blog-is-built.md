---
title: How this blog is built
description: From a Markdown file to your screen. The build pipeline, the Orange Pi that serves the pages, and the home network in between.
date: 2026-09-17
category: side-projects
tags: [self-hosting, astro, coolify, docker, networking, meta]
---

This blog runs on a single-board computer in my apartment, behind a consumer fibre line. This post follows a page from the Markdown file I write to the HTML you are reading, with a diagram for each step.

## Writing

Every post is a Markdown file in a Git repository. [Astro](https://astro.build) checks the front matter against a schema at build time, so a typo in a date or a category breaks the build instead of quietly publishing a broken page.

```markdown
---
title: How this blog is built
date: 2026-09-17
category: side-projects
tags: [self-hosting, astro]
---
```

Astro turns the Markdown into plain HTML and CSS. Pages ship no JavaScript except the few lines behind the theme toggle, and code blocks are highlighted at build time.

## Building

Nothing is built on the Pi. A push to `main` starts a GitHub Actions workflow that builds the image, checks it, publishes it, and only then tells the Pi to deploy.

```text
git push origin main
        |
        v
+-- GitHub Actions, x86 runner -------------------+
|                                                 |
|  bun install, astro build    Markdown -> HTML   |
|  docker build linux/arm64    Caddy + dist/      |
|  trivy scan                  stop on CRITICAL   |
|  push to ghcr.io             :latest, :sha-...  |
|  cosign sign                 keyless, Sigstore  |
|  cosign attest               CycloneDX SBOM     |
|                                                 |
+------------------------+------------------------+
                         |
                         |  POST /api/v1/deploy
                         v
+-- Coolify, on the Orange Pi --------------------+
|                                                 |
|  pull ghcr.io/matbour/mat.bour.io:latest        |
|  replace the running container                  |
|                                                 |
+-------------------------------------------------+
```

The Pi is an arm64 board and GitHub's standard runners are x86. Because the site is plain files, the [Bun](https://bun.sh) build stage runs on the runner's own architecture and only the final stage targets arm64. That stage copies files into a [Caddy](https://caddyserver.com) image, so there is no emulation and the build stays fast.

```dockerfile
FROM --platform=$BUILDPLATFORM oven/bun:1.4-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts
COPY . .
RUN bun --bun run build

FROM caddy:2.11-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
```

Before anything is published, [Trivy](https://trivy.dev) scans the image and the run fails on a critical vulnerability that has a fix. The pushed image is then signed with [cosign](https://docs.sigstore.dev/cosign/) in keyless mode: the workflow's OIDC token is exchanged for a short-lived certificate, so there is no signing key to store or rotate. A signed SBOM is attached next to it.

The deploy step calls the Coolify API with a token that can only trigger deployments. That token is a secret of a GitHub environment that only `main` can use, so a pull request can never deploy.

## Serving

Visitors never connect to my home network. The Pi opens an outbound connection to Cloudflare, and requests come back down through it.

```text
reader
  |  https://mat.bour.io
  v
+-- Cloudflare edge ------------------------------+
|  DNS: *.bour.io -> tunnel                       |
|  TLS certificate, DDoS protection               |
+------------------------+------------------------+
                         |
                         |  Cloudflare Tunnel, opened from home:
                         |  no port is open on the router
                         v
+-- Orange Pi 5 Plus -----------------------------+
|                                                 |
|  cloudflared (systemd service)                  |
|            |  http://localhost:80               |
|            v                                    |
|  coolify-proxy (Caddy)                          |
|            |  Host: mat.bour.io                 |
|            v                                    |
|  blog container (Caddy + static HTML)           |
|                                                 |
+-------------------------------------------------+
```

A wildcard `*.bour.io` record points at the tunnel, and the tunnel forwards every hostname to Coolify's proxy. A new site needs no DNS change: Coolify generates the proxy route from the domain I give the application. TLS ends at Cloudflare and the tunnel carries plain HTTP, so the blog container only listens on port 80.

One detail cost me hours the first time. Coolify's domain field has to be `http://mat.bour.io`, not `mat.bour.io`. Without the scheme, Caddy turns on automatic HTTPS and redirects every request to HTTPS. Cloudflare sends that redirect back to the browser, which comes back through the tunnel over HTTP and gets redirected again, forever.

The blog container itself is a few lines of Caddy configuration:

```text
:80 {
	root * /srv
	encode zstd gzip
	header /_astro/* Cache-Control "public, max-age=31536000, immutable"
	file_server
}
```

Hashed assets are cached for a year. HTML is revalidated on every request, so a new post shows up as soon as the container is replaced.

## The hardware

The server is an Orange Pi 5 Plus: a Rockchip RK3588 with 8 cores, 16 GB of RAM, a 4 TB NVMe SSD and two 2.5 GbE ports. It runs Ubuntu and boots straight from the SSD.

```text
+-- Orange Pi 5 Plus ---------------------------------+
|  RK3588, 8 cores, 16 GB RAM, 4 TB NVMe, 2x 2.5 GbE  |
|  Ubuntu, Docker                                     |
|                                                     |
|  cloudflared        coolify + coolify-proxy         |
|  +---------------+  +---------------+  +---------+  |
|  | mat.bour.io   |  | media server  |  | other   |  |
|  | (this blog)   |  |               |  | tools   |  |
|  +---------------+  +---------------+  +---------+  |
+-----------------------------------------------------+
```

The blog is one of several applications on the board, all managed by [Coolify](https://coolify.io). A static site served by Caddy uses almost no memory, so it doesn't compete with the rest.

## The network

The line is Bouygues Telecom's B&You Pure Fibre Plus: XGS-PON fibre, 8 Gb/s down and 1 Gb/s up, with no TV and no landline. Bouygues normally ships its Bbox, which combines the fibre termination and the router. I asked for a standalone ONT instead, a small Nokia module that turns the fibre into Ethernet, so a UniFi Cloud Gateway Fiber can be the only router.

```text
           Bouygues Telecom, XGS-PON
           8 Gb/s down, 1 Gb/s up
                      |
                      |  fibre
                      v
           +---------------------+
           | Nokia ONT           |   fibre -> Ethernet
           +----------+----------+
                      |
                      |  10 GbE, WAN port, VLAN 100
                      v
+-----------------------------------------------------+
| UniFi Cloud Gateway Fiber                           |
| router, firewall, DHCP, LAN 192.168.1.0/24          |
+---------+-----------------+-----------------+-------+
          |                 |                 |
          | 2.5 GbE         | 2.5 GbE         |
          v                 v                 v
   Orange Pi 5 Plus     desktop PC      U7 Long-Range
   192.168.1.10                         Wi-Fi access point
```

Getting there took two steps. For the first few days the Bbox was still in the path, with the gateway behind it in the Bbox's DMZ. That worked, but it meant two routers doing NAT. Both also default to `192.168.1.x`, and with its WAN and LAN in the same subnet the gateway refused its WAN lease and reported no Internet. I moved the Bbox to `192.168.100.0/24` so the Pi could keep its address.

```text
before   fibre -> Bbox (router, NAT) -> UniFi (router, NAT) -> LAN
after    fibre -> Nokia ONT          -> UniFi (router, NAT) -> LAN
```

With the ONT, the gateway receives the public IPv4 address itself. It has to look like a Bbox to Bouygues' network, which comes down to a few settings, all in the UniFi interface with no SSH overrides. I followed the community recap on [lafibre.info](https://lafibre.info), where people who replace their Bbox share what works.

| Setting     | Value                                             |
| ----------- | ------------------------------------------------- |
| VLAN ID     | 100                                               |
| MAC address | cloned from the Bbox                              |
| IPv4        | DHCP, vendor class (option 60) `BYGTELIAD`, CoS 6 |
| IPv6        | DHCPv6, CoS 6, prefix delegation `/60`            |

The Bbox is now in a drawer. If the ONT ever misbehaves, the DMZ setup is written down and I can put it back.

## What it all adds up to

A post goes from `git push` to live in a few minutes. The image that runs is the one that was scanned and signed, and there is no open port on my router. The whole thing runs on one small board on a shelf at home.
