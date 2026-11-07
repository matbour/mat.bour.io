# syntax=docker/dockerfile:1

# ---- Build: Markdown -> static HTML ----
# The output is plain files, the same on every CPU, so this stage always runs on
# the builder's own platform. CI can then build the arm64 image on an x86 runner
# without emulation: the Caddy stage below only copies files.
FROM --platform=$BUILDPLATFORM oven/bun:1.4-alpine AS build
WORKDIR /app

COPY package.json bun.lock ./
# --ignore-scripts: skips "prepare" (git hooks), there is no .git in the image.
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .

# Optional analytics, passed by Coolify as build variables.
ARG PUBLIC_UMAMI_SRC
ARG PUBLIC_UMAMI_WEBSITE_ID
ENV ASTRO_TELEMETRY_DISABLED=1

# --bun runs Astro on Bun's runtime; the image has no Node.
RUN bun --bun run build

# ---- Serve: Caddy, nothing else at runtime ----
FROM caddy:2.11-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://127.0.0.1/ || exit 1
