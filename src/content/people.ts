import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { PEOPLE_QUERY } from '@lib/sanity/queries/peopleQuery';
import { SPEAKERS_QUERY } from '@lib/sanity/queries/speakersQuery';
import { workspaces } from '@lib/sanity/workspaces';
import {
    FeaturedImage,
    RichTextBlocks,
} from '@content/schemaFragments/sanityComponents';
import { customSanityLoader } from '@lib/sanity/customSanityLoader';

export const people = defineCollection({
    loader: customSanityLoader({
        name: 'People',
        query: PEOPLE_QUERY,
        params: {
            workspaceID: workspaces.pourdavoud.id,
        },
    }),

    schema: z.object({
        _id: z.string(),
        _type: z.literal('person'),
        title: z.string(),
        slug: z.string(),
        name: z.object({
            firstName: z.string(),
            lastName: z.string(),
        }),
        affiliationType: z.enum(['internal', 'ucla', 'external']),
        image: FeaturedImage.nullish(),
        internalRoles: z.array(
            z.object({
                _type: z.string(),
                title: z.string(),
                organization: z.object({
                    _id: z.string(),
                    title: z.string(),
                }),
            }),
        ),
        department: z.string().nullish(), // to deprecate
        departments: z.array(z.string()),
        institution: z.string().nullish(),
        facultyLink: z.string().nullish(),
        facultyTitle: z.string().nullish(),
        contact: z
            .object({
                email: z.string().nullish(),
            })
            .nullish(),
        biography: RichTextBlocks,
        showCV: z.boolean().nullish(),
        cvSections: z
            .array(
                z.object({
                    _key: z.string(),
                    _type: z.enum(['cvSection', 'publicationList']),
                    title: z.string(),
                    richText: z
                        .object({
                            blocks: RichTextBlocks,
                        })
                        .nullish(),
                    publications: z
                        .array(
                            z.object({
                                _id: z.string(),
                            }),
                        )
                        .nullish(),
                }),
            )
            .nullish(),
        categories: z.array(
            z
                .object({
                    _id: z.string(),
                    _type: z.string(),
                    title: z.string(),
                    slug: z.string(),
                })
                .nullish(),
        ),
    }),
});

export const speakers = defineCollection({
    loader: customSanityLoader({
        name: 'Speakers',
        query: SPEAKERS_QUERY,
        params: {
            workspaceID: workspaces.pourdavoud.id,
        },
    }),

    schema: z.object({
        _id: z.string(),
        _type: z.literal('personSpeaker'),
        title: z.string(),
        slug: z.string(),
        name: z.object({
            firstName: z.string(),
            lastName: z.string(),
        }),
        image: FeaturedImage.nullish(),
        biography: RichTextBlocks,
        institution: z.string().nullish(),
        facultyLink: z.string().nullish(),
    }),
});
