# @arraypress/analytics-astro

Multi-provider analytics for Astro in one component. Pass the providers you want; it renders the right script tags with a built-in **Do-Not-Track / Global-Privacy-Control short-circuit** and **consent gating** for cookie-using providers.

Supports **Plausible, Cloudflare, Umami, Fathom, Simple Analytics, GoatCounter, GA4**, and a `custom` escape hatch.

## Install

```bash
npm install @arraypress/analytics-astro
```

## Usage

Drop it once in your `<head>`:

```astro
---
import { Analytics } from '@arraypress/analytics-astro';
---
<head>
  <Analytics providers={[
    { type: 'plausible', domain: 'example.com' },
    { type: 'ga4', measurementId: 'G-XXXXXXX' },
  ]} />
</head>
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `providers` | `AnalyticsProvider[]` | `[]` | Empty → nothing renders. |
| `respectDNT` | `boolean` | `true` | Inline DNT/GPC check runs before any script is fetched. |
| `productionOnly` | `boolean` | `true` | No scripts in `astro dev` (`import.meta.env.PROD`). |
| `consentStorageKey` | `string` | `'cookie-consent'` | localStorage key your banner sets. |
| `consentAcceptedValue` | `string` | `'accepted'` | Value meaning "accepted". |
| `consentEventName` | `string` | `'consent-accepted'` | Window event your banner dispatches on accept. |

## Providers

```ts
{ type: 'plausible',   domain: 'example.com', src?, apiHost? }
{ type: 'cloudflare',  token: '…' }
{ type: 'umami',       websiteId: '…', src? }
{ type: 'fathom',      siteId: '…' }
{ type: 'simple',      src? }
{ type: 'goatcounter', endpoint: 'https://you.goatcounter.com/count' }
{ type: 'ga4',         measurementId: 'G-XXXXXXX' }     // consent-gated
{ type: 'custom',      html: '<script>…</script>' }     // consent-gated
```

## Privacy

- **DNT/GPC** — with `respectDNT` (default), an inline guard sets `window.__apAnalyticsAllowed = false` when the visitor signals Do-Not-Track or Global Privacy Control, and **every** provider checks it before loading. Nothing beacons.
- **Consent** — `ga4` and `custom` use cookies / send data, so they additionally wait until `localStorage[consentStorageKey] === consentAcceptedValue`. They fire on load if consent is already stored, and re-arm on the `consentEventName` window event so the first accept after page load injects them without a reload. Cookie-free providers (Plausible, Cloudflare, Umami, Fathom, Simple, GoatCounter) only need the DNT check.

Pair with any cookie-consent banner: write the storage key on accept, dispatch the event, and GA4/custom light up.

## License

MIT
