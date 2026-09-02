import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { EVENTS_QUERY } from '@lib/sanity/queries/eventsQuery';
import { FeaturedImage } from '@content/schemaFragments/sanityComponents';
import { RichText } from '@content/schemaFragments/pageModules';
import { workspaces } from '@lib/sanity/workspaces';
import { customSanityLoader } from '@lib/sanity/customSanityLoader';

export const events = defineCollection({
    loader: customSanityLoader({
        name: 'Events',
        query: EVENTS_QUERY,
        params: {
            workspaceID: workspaces.pourdavoud.id,
        },
    }),

    schema: z.object({
        _id: z.string(),
        _type: z.literal('event'),
        title: z.string(),
        slug: z.string(),
        details: z.object({
            startDate: z.string(),
            endDate: z.string().nullish(),
            multiDay: z.boolean(),
            startTime: z.string().nullish(),
            endTime: z.string().nullish(),
            location: z.string().nullish(),
            rsvpLink: z.string().nullish(),
        }),
        previewTitle: z.string().nullish(),
        preview: z.nullable(z.array(z.any())),
        image: FeaturedImage.nullish(),
        richText: RichText.nullish(),
        speakersRef: z.array(
            z.object({
                _id: z.string(),
                _type: z.literal('personSpeaker'),
                slug: z.string(),
            }),
        ),
        place: z.array(
            z.object({
                name: z.string(),
                location: z.object({
                    streetAddress: z.string(),
                    extendedAddress: z.string().nullish(),
                    addressLocality: z.string(),
                    addressRegion: z.string(),
                    postalCode: z.string(),
                    addressCountry: z.string(),
                }),
            }),
        ),
        videos: z.array(z.object({ _id: z.string() })),
        categories: z.array(
            z.object({
                _id: z.string(),
                _type: z.literal('eventCategory'),
                title: z.string(),
                slug: z.string(),
            }),
        ),
        tags: z.array(
            z.object({
                _type: z.literal('tag'),
                title: z.string(),
                slug: z.string(),
            }),
        ),
    }),
});
