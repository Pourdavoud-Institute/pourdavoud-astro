import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { ORGANIZATIONS_QUERY } from '@lib/sanity/queries/organizationsQuery';
import { RichText } from '@content/schemaFragments/pageModules';
import { FeaturedImage } from '@content/schemaFragments/sanityComponents';
import { workspaces } from '@lib/sanity/workspaces';
import { customSanityLoader } from '@lib/sanity/customSanityLoader';

export const organizations = defineCollection({
    loader: customSanityLoader({
        name: 'Organizations',
        query: ORGANIZATIONS_QUERY,
        params: {
            workspaceID: workspaces.pourdavoud.id,
        },
    }),

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
