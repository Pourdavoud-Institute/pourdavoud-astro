import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { PAGES_QUERY } from '@lib/sanity/queries/pagesQuery';
import { workspaces } from '@lib/sanity/workspaces';
import { PageModules } from '@content/schemaFragments/pageModules';
import {
    FeaturedImage,
    PageTemplate,
    SEOBlock,
    OGBlock,
} from '@content/schemaFragments/sanityComponents';
import { customSanityLoader } from '@lib/sanity/customSanityLoader';

const PageHeader = z.object({
    preview: z.nullable(z.array(z.any())),
    layout: z.enum(['default', 'simple', 'singleImage', 'splitPane']),
    image: FeaturedImage.nullish(),
});

export type PageHeader = z.infer<typeof PageHeader>;

/** Fetches page data from Sanity and creates typed schema */
export const pages = defineCollection({
    loader: customSanityLoader({
        name: 'Pages',
        query: PAGES_QUERY,
        params: {
            workspaceID: workspaces.pourdavoud.id,
        },
    }),

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
        children: z.array(
            z.object({
                _id: z.string(),
            }),
        ),
        template: PageTemplate,
        indexCollection: z
            .enum([
                'events',
                'upcoming-events',
                'videos',
                'people',
                'posts',
                'podcast',
            ])
            .nullish(),
        header: PageHeader.nullish(),
        modules: PageModules,
        people: z.object({
            peopleGrid: z.array(
                z.object({
                    _id: z.string(),
                }),
            ),
            peopleFilter: z.string().nullish(),
        }),
        options: z.object({
            layout: z.enum(['default', 'sidebar']).nullish(),
            footerMargin: z.boolean().nullish(),
        }),
        seo: SEOBlock,
        openGraph: OGBlock,
    }),
});
