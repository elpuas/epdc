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
				'flask', 'shopping-cart', 'lifebuoy', 'mask-happy', 
				'shield-check', 'code', 'gauge', 'lightning',
				'cpu-bold', 'chart-line-up-bold', 'brain-bold', 'handshake-bold',
				'browser', 'trending-up', 'rocket-launch-bold'
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
