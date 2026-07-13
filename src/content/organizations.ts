import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { sanityClient } from '@lib/sanity/client';
import { ORGANIZATIONS_QUERY } from '@lib/sanity/queries/organizationsQuery';
import type { SanityDocument } from '@sanity/client';
import { RichText } from '@content/schemaFragments/pageModules';
import { FeaturedImage } from '@content/schemaFragments/sanityComponents';
import { workspaces } from '@lib/sanity/workspaces';

export const organizations = defineCollection({
    loader: async () => {
        const organizations = await sanityClient.fetch<SanityDocument[]>(
            ORGANIZATIONS_QUERY,
            {
                workspaceID: workspaces.pourdavoud.id,
            },
        );

        return organizations.map((organization) => ({
            id: organization._id,
            ...organization,
        }));
    },

    schema: z.object({
        _id: z.string(),
        _type: z.literal('externalOrganization'),
        title: z.string(),
        slug: z.string(),
        url: z.url().nullish(),
        preview: z.nullable(z.array(z.any())),
        image: FeaturedImage.nullish(),
        richText: RichText.nullish(),
    }),
});
