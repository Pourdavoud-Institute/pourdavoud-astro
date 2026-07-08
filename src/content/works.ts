import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { sanityClient } from '@lib/sanity/client';
import type { SanityDocument } from '@sanity/client';
import { WORKS_QUERY } from '@lib/sanity/queries/worksQuery';
import { workspaces } from '@lib/sanity/workspaces';
import { RichTextBlocks } from '@content/schemaFragments/sanityComponents';

export const works = defineCollection({
    loader: async () => {
        const works = await sanityClient.fetch<SanityDocument[]>(WORKS_QUERY, {
            workspaceID: workspaces.pourdavoud.id,
        });

        return works.map((work) => ({
            id: work._id,
            ...work,
        }));
    },

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
