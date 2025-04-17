// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './src/i18n/utils';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	i18n: {
		defaultLocale: DEFAULT_LANGUAGE,
		locales: SUPPORTED_LANGUAGES,
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
