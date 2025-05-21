// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icons from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './src/i18n/utils';

/** @type {import('astro').AstroUserConfig} */
export default defineConfig({
	site: 'https://elpuasdigitalcrafts.com',
	integrations: [
		mdx(), 
		sitemap(), 
		icons({
			include: {
				// Use a simpler approach with fewer icons to reduce build issues
				ph: ['*'],
				'circle-flags': ['*']
			},
		})
	],
	i18n: {
		defaultLocale: DEFAULT_LANGUAGE,
		locales: [...SUPPORTED_LANGUAGES],
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
