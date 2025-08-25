import { defineCollection, z } from 'astro:content';
import { sanityClient } from 'sanity:client';
import { PEOPLE_QUERY } from '@lib/sanity/queries/peopleQuery';
import { SPEAKERS_QUERY } from '@lib/sanity/queries/speakersQuery';
import type { SanityDocument } from '@sanity/client';
import { workspaces } from '@lib/sanity/workspaces';
import {
    FeaturedImage,
    RichTextBlocks,
} from '@content/schemaFragments/sanityComponents';

export const people = defineCollection({
    loader: async () => {
        const people = await sanityClient.fetch<SanityDocument[]>(
            PEOPLE_QUERY,
            {
                workspaceID: workspaces.pourdavoud.id,
            },
        );

        return people.map((person) => ({
            id: person._id,
            ...person,
        }));
    },

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
                    _type: z.string(),
                    title: z.string(),
                    slug: z.string(),
                })
                .nullish(),
        ),
    }),
});

export const speakers = defineCollection({
    loader: async () => {
        const speakers = await sanityClient.fetch<SanityDocument[]>(
            SPEAKERS_QUERY,
            {
                workspaceID: workspaces.pourdavoud.id,
            },
        );

        return speakers.map((speaker) => ({
            id: speaker._id,
            ...speaker,
        }));
    },

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
