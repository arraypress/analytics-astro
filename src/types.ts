/**
 * @module @arraypress/analytics-astro/types
 */

/** Plausible — privacy-first, cookie-free. `data-domain` is required. */
export interface PlausibleProvider {
	type: 'plausible';
	/** Site domain registered in Plausible (the `data-domain` value). */
	domain: string;
	/** Script src override (self-hosted installs). */
	src?: string;
	/** Events API host override (`data-api`) for self-hosted installs. */
	apiHost?: string;
}

/** Cloudflare Web Analytics — beacon-style, `token` from the dashboard. */
export interface CloudflareProvider {
	type: 'cloudflare';
	/** Beacon token from the Cloudflare dashboard. */
	token: string;
}

/** Umami — `data-website-id` from your Umami instance. */
export interface UmamiProvider {
	type: 'umami';
	/** Website id (the `data-website-id` value). */
	websiteId: string;
	/** Script src override (self-hosted / cloud region). */
	src?: string;
}

/** Fathom Lite — `data-site` id, loads from cdn.usefathom.com. */
export interface FathomProvider {
	type: 'fathom';
	/** Site id (the `data-site` value). */
	siteId: string;
}

/** Simple Analytics — no config attributes needed. */
export interface SimpleProvider {
	type: 'simple';
	/** Script src override. */
	src?: string;
}

/** GoatCounter — async tracker pinging your subdomain endpoint. */
export interface GoatCounterProvider {
	type: 'goatcounter';
	/** Your GoatCounter endpoint (the `data-goatcounter` value). */
	endpoint: string;
}

/** Google Analytics 4 — the gtag pattern. NOT cookie-free, so it's
 *  gated on explicit consent + the DNT/GPC check. */
export interface GA4Provider {
	type: 'ga4';
	/** Measurement id (`G-XXXXXXX`). */
	measurementId: string;
}

/** Custom escape hatch — arbitrary `<script>` HTML, gated on consent
 *  (same as ga4) because the embedded code can't be introspected. */
export interface CustomProvider {
	type: 'custom';
	/** Raw HTML (script tags) injected after consent + DNT pass. */
	html: string;
}

/** A single analytics provider. Discriminated on `type`. */
export type AnalyticsProvider =
	| PlausibleProvider
	| CloudflareProvider
	| UmamiProvider
	| FathomProvider
	| SimpleProvider
	| GoatCounterProvider
	| GA4Provider
	| CustomProvider;

/** Props for `<Analytics />`. */
export interface AnalyticsProps {
	/** Providers to load. Empty / omitted → nothing renders. */
	providers?: AnalyticsProvider[];
	/**
	 * Skip an inline DNT/Global-Privacy-Control check before any
	 * provider script is fetched. Default: `true` (respect DNT/GPC).
	 */
	respectDNT?: boolean;
	/**
	 * Only emit scripts in a production build (`import.meta.env.PROD`).
	 * Default: `true` — keeps dev sessions out of your analytics.
	 */
	productionOnly?: boolean;
	/**
	 * localStorage key the consent banner writes. Cookie-using
	 * providers (`ga4`, `custom`) only fire once this equals
	 * `consentAcceptedValue`. Default: `'cookie-consent'`.
	 */
	consentStorageKey?: string;
	/** Value that means "accepted" in `consentStorageKey`. Default: `'accepted'`. */
	consentAcceptedValue?: string;
	/**
	 * Window event your banner dispatches on accept, so consent-gated
	 * providers fire without a reload. Default: `'consent-accepted'`.
	 */
	consentEventName?: string;
}
