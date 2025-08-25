import { defineCollection, z } from 'astro:content';
import { sanityClient } from 'sanity:client';
import { PAGES_QUERY } from '@lib/sanity/queries/pagesQuery';
import type { SanityDocument } from '@sanity/client';
import { workspaces } from '@lib/sanity/workspaces';
import { PageModules } from '@content/schemaFragments/pageModules';
import {
    FeaturedImage,
    PageTemplate,
    SEOBlock,
    OGBlock,
} from '@content/schemaFragments/sanityComponents';

const PageHeader = z.object({
    preview: z.nullable(z.array(z.any())),
    layout: z.enum(['default', 'simple', 'singleImage', 'splitPane']),
    image: FeaturedImage.nullish(),
});

export type PageHeader = z.infer<typeof PageHeader>;

/** Fetches page data from Sanity and creates typed schema */
export const pages = defineCollection({
    loader: async () => {
        const pages = await sanityClient.fetch<SanityDocument[]>(PAGES_QUERY, {
            workspaceID: workspaces.pourdavoud.id,
        });

        return pages.map((page) => ({
            id: page._id,
            ...page,
        }));
    },

    schema: z.object({
        _id: z.string(),
        _type: z.literal('page'),
        title: z.string(),
        slug: z.string(),
        parent: z
            .object({
                title: z.string(),
                slug: z.string(),
            })
            .nullish(),
        template: PageTemplate,
        indexCollection: z
            .enum(['events', 'upcoming-events', 'videos', 'posts', 'podcast'])
            .nullish(),
        header: PageHeader.nullish(),
        modules: PageModules,
        options: z.object({
            layout: z.enum(['default', 'sidebar']).nullish(),
            footerMargin: z.boolean().nullish(),
        }),
        seo: SEOBlock,
        openGraph: OGBlock,
    }),
});
