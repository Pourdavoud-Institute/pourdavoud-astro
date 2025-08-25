import { defineCollection, z } from 'astro:content';
import { sanityClient } from 'sanity:client';
import type { SanityDocument } from '@sanity/client';
import { PUBLICATIONS_QUERY } from '@lib/sanity/queries/publicationsQuery';
import { workspaces } from '@lib/sanity/workspaces';
import { RichTextBlocks } from '@content/schemaFragments/sanityComponents';

export const publications = defineCollection({
    loader: async () => {
        const publications = await sanityClient.fetch<SanityDocument[]>(
            PUBLICATIONS_QUERY,
            {
                workspaceID: workspaces.pourdavoud.id,
            },
        );

        return publications.map((publication) => ({
            id: publication._id,
            ...publication,
        }));
    },

    schema: z.object({
        _id: z.string(),
        _type: z.literal('publication'),
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
