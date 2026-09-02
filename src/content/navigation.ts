import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { NAVIGATION_QUERY } from '@lib/sanity/queries/navigationQuery';
import { Link } from '@content/schemaFragments/sanityComponents';
import { workspaces } from '@lib/sanity/workspaces';
import { customSanityLoader } from '@lib/sanity/customSanityLoader';

/** Fetches navigation data from Sanity and creates typed schema */
export const navigation = defineCollection({
    loader: customSanityLoader({
        name: 'Navigation',
        query: NAVIGATION_QUERY,
        params: {
            workspaceID: workspaces.pourdavoud.id,
        },
    }),

    schema: z.object({
        _id: z.string(),
        _type: z.literal('navigation'),
        title: z.string(),
        items: z.array(
            z.union([
                Link.extend({
                    itemType: z.literal('link'),
                }),
                z.object({
                    itemType: z.literal('linkList'),
                    label: z.string(),
                    links: z.array(Link),
                }),
            ]),
        ),
    }),
});
