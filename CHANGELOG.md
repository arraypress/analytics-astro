# Changelog

All notable changes to `@arraypress/analytics-astro` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] — Unreleased

### Changed

- Widened the `astro` peerDependency to `^6.0.0 || ^7.0.0` for
  Astro 7 readiness. No runtime changes — the component is unaffected by the
  Astro 7 compiler / Vite 8 (Rolldown) upgrade.

## [1.0.0] — Unreleased

### Added

- `<Analytics providers={…} />` — one component rendering the canonical
  script tags for Plausible, Cloudflare, Umami, Fathom, Simple,
  GoatCounter, GA4, and a `custom` escape hatch. Inline DNT/GPC
  short-circuit before any provider is fetched; `ga4` + `custom` gate on
  a configurable consent key/event so they fire on accept without a
  reload. `productionOnly` keeps dev sessions out of analytics.
  Decoupled (props, not siteConfig) from the version shared across the
  ArrayPress Astro theme family.
