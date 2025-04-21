// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icons from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './src/i18n/utils';

/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap(), icons({
		include: {
			ph: [
				// Regular icons
				'flask', 'shopping-cart', 'lifebuoy', 'mask-happy', 
				'shield-check', 'code', 'gauge', 'lightning',
				'browser', 'trending-up', 'handshake', 'rocket-launch', 
				'brain', 'magnifying-glass', 'pen-nib', 'truck', 
				'chart-line-up', 'cpu', 'arrow-right',
				
				// Bold variants
				'cpu-bold', 'chart-line-up-bold', 'brain-bold', 
				'handshake-bold', 'rocket-launch-bold', 'flask-bold',
				'shopping-cart-bold', 'lifebuoy-bold', 'mask-happy-bold',
				'shield-check-bold', 'code-bold', 'gauge-bold', 
				'lightning-bold', 'browser-bold', 'trending-up-bold',
				'magnifying-glass-bold', 'pen-nib-bold', 'truck-bold'
			],
		},
	})],
	i18n: {
		defaultLocale: DEFAULT_LANGUAGE,
		locales: [...SUPPORTED_LANGUAGES],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	redirects: {
		'/': {
			status: 302,
			destination: `/${DEFAULT_LANGUAGE}`,
		},
	},
});
