// @ts-check
import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
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
				ph: ['*'],
				'circle-flags': ['*']
			},
		}),
		partytown({ config: { forward: ['dataLayer.push'] } })
	],
	i18n: {
		defaultLocale: DEFAULT_LANGUAGE,
		locales: [...SUPPORTED_LANGUAGES],
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
