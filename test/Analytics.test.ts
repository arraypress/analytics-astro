import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import AnalyticsRaw from '../src/Analytics.astro';
import type { AnalyticsProps } from '../src/types';

const Analytics = AnalyticsRaw as Parameters<AstroContainer['renderToString']>[0];

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

async function render(props: AnalyticsProps = {}): Promise<string> {
	return container.renderToString(Analytics, {
		props: props as unknown as Record<string, unknown>,
	});
}

describe('<Analytics>', () => {
	it('renders nothing with no providers', async () => {
		const html = await render();
		expect(html.includes('<script')).toBe(false);
	});

	it('renders nothing in dev when productionOnly (default)', async () => {
		// Container renders with import.meta.env.PROD === false.
		const html = await render({ providers: [{ type: 'plausible', domain: 'example.com' }] });
		expect(html.includes('<script')).toBe(false);
	});

	it('emits the DNT guard + a provider when productionOnly is off', async () => {
		const html = await render({
			productionOnly: false,
			providers: [{ type: 'plausible', domain: 'example.com' }],
		});
		expect(html).toContain('__apAnalyticsAllowed');
		expect(html).toContain('plausible.io/js/script.js');
		expect(html).toContain('data-domain');
		expect(html).toContain('example.com');
	});

	it('skips the DNT guard body when respectDNT is false', async () => {
		const html = await render({
			productionOnly: false,
			respectDNT: false,
			providers: [{ type: 'cloudflare', token: 'abc123' }],
		});
		// Guard still defines the flag, but not via the DNT/GPC branch.
		expect(html).toContain('__apAnalyticsAllowed=true');
		expect(html).not.toContain('globalPrivacyControl');
		expect(html).toContain('static.cloudflareinsights.com/beacon.min.js');
	});

	it('gates ga4 on consent + uses the custom consent event name', async () => {
		const html = await render({
			productionOnly: false,
			consentEventName: 'cookie-accept',
			providers: [{ type: 'ga4', measurementId: 'G-TEST123' }],
		});
		expect(html).toContain('googletagmanager.com/gtag/js?id=G-TEST123');
		expect(html).toContain('__apConsentOk');
		expect(html).toContain('cookie-accept');
	});

	it('honours a custom consent storage key', async () => {
		const html = await render({
			productionOnly: false,
			consentStorageKey: 'my-consent',
			providers: [{ type: 'ga4', measurementId: 'G-X' }],
		});
		expect(html).toContain('my-consent');
	});

	it('renders every provider type without error', async () => {
		const html = await render({
			productionOnly: false,
			providers: [
				{ type: 'plausible', domain: 'a.com' },
				{ type: 'cloudflare', token: 't' },
				{ type: 'umami', websiteId: 'w' },
				{ type: 'fathom', siteId: 's' },
				{ type: 'simple' },
				{ type: 'goatcounter', endpoint: 'https://x.goatcounter.com/count' },
				{ type: 'ga4', measurementId: 'G-1' },
				{ type: 'custom', html: '<script>console.log(1)</script>' },
			],
		});
		expect(html).toContain('umami.is/script.js');
		expect(html).toContain('usefathom.com/script.js');
		expect(html).toContain('simpleanalyticscdn.com');
		expect(html).toContain('gc.zgo.at/count.js');
	});
});
