import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { WORKS_QUERY } from '@lib/sanity/queries/worksQuery';
import { workspaces } from '@lib/sanity/workspaces';
import { RichTextBlocks } from '@content/schemaFragments/sanityComponents';
import { customSanityLoader } from '@lib/sanity/customSanityLoader';

export const works = defineCollection({
    loader: customSanityLoader({
        name: 'Works',
        query: WORKS_QUERY,
        params: {
            workspaceID: workspaces.pourdavoud.id,
        },
    }),

    schema: z.object({
        _id: z.string(),
        _type: z.literal('work'),
        title: z.string(),
        subtitle: z.string().nullish(),
        slug: z.string(),
        type: z.enum(['book', 'article', 'journal']),
        authors: z.array(
            z.object({
                _type: z.enum(['author', 'authorReference']),
                role: z.enum(['author', 'editor']),
                name: z.string().nullish(),
                reference: z
                    .object({
                        _id: z.string(),
                        _type: z.literal('person'),
                        slug: z.string(),
                    })
                    .nullish(),
            }),
        ),
        publisher: z.string().nullish(),
        publicationDate: z.string().nullish(),
        publicationLink: z.string().nullish(),
        citation: z.string().nullish(),
        image: z
            .object({
                asset: z.any(),
            })
            .nullish(),
        description: RichTextBlocks,
        options: z.object({
            createRoute: z.boolean().nullish(),
        }),
    }),
});
