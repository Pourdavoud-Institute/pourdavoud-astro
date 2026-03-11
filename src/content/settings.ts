import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { sanityClient } from '@lib/sanity/client';
import { SITE_SETTINGS_QUERY } from '@lib/sanity/queries/siteSettingsQuery';
import type { SanityDocument } from '@sanity/client';
import { SEOBlock, OGBlock } from '@content/schemaFragments/sanityComponents';

export const settings = defineCollection({
    loader: async () => {
        const settings =
            await sanityClient.fetch<SanityDocument[]>(SITE_SETTINGS_QUERY);

        return settings.map((item) => ({
            id: item._id,
            ...item,
        }));
    },

    schema: z.object({
        _id: z.string(),
        _type: z.literal('siteSettingsPourdavoud'),
        siteName: z.string(),
        siteDomain: z.string(),
        seo: SEOBlock,
        openGraph: OGBlock,
    }),
});
