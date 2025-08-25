import { defineCollection, z } from 'astro:content';
import { sanityClient } from 'sanity:client';
import { NAVIGATION_QUERY } from '@lib/sanity/queries/navigationQuery';
import { Link } from '@content/schemaFragments/sanityComponents';
import type { SanityDocument } from '@sanity/client';
import { workspaces } from '@lib/sanity/workspaces';

/** Fetches navigation data from Sanity and creates typed schema */
export const navigation = defineCollection({
    loader: async () => {
        const navigation = await sanityClient.fetch<SanityDocument[]>(
            NAVIGATION_QUERY,
            {
                workspaceID: workspaces.pourdavoud.id,
            },
        );

        return navigation.map((entry) => ({
            id: entry._id,
            ...entry,
        }));
    },

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
