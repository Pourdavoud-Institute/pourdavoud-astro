// @ts-check
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import preact from '@astrojs/preact';
// import preactVite from '@preact/preset-vite';
import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
    site: 'https://pourdavoud.ucla.edu',

    integrations: [
        sanity({
            projectId: '3z4imst3',
            dataset: 'production',
            useCdn: false,
        }),
        preact({ compat: true }),
    ],

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

    adapter: node({
        mode: 'standalone',
    }),
    env: {
        schema: {
            WEBHOOK_SECRET: envField.string({
                context: 'server',
                access: 'secret',
            }),
        },
    },
});
