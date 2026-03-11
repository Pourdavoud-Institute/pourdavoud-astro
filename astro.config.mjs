// @ts-check
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
    site: 'https://pourdavoud.ucla.edu',

    integrations: [sitemap(), vue()],

    image: {
        domains: ['cdn.sanity.io'],
    },

    prefetch: {
        prefetchAll: true,
    },

    vite: {
        css: {
            transformer: 'lightningcss',
            lightningcss: {
                targets: browserslistToTargets(browserslist('defaults')),
            },
        },
        build: {
            cssMinify: 'lightningcss',
        },
    },

    redirects: {
        '/media': '/media/video-library',
        '/media/videos': '/media/video-library',
    },
});
