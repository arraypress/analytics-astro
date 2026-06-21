/**
 * @module @arraypress/analytics-astro
 *
 * A single multi-provider analytics component for Astro. Pass the
 * providers you want; it renders the right script tags with a built-in
 * DNT/GPC short-circuit and consent gating for cookie-using providers.
 *
 * ```astro
 * ---
 * import { Analytics } from '@arraypress/analytics-astro';
 * ---
 * <head>
 *   <Analytics providers={[
 *     { type: 'plausible', domain: 'example.com' },
 *     { type: 'ga4', measurementId: 'G-XXXXXXX' },
 *   ]} />
 * </head>
 * ```
 */

import Analytics from './Analytics.astro';

export { Analytics };
export type * from './types';
export default Analytics;
