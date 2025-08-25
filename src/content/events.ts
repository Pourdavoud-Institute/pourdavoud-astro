import { defineCollection, z } from 'astro:content';
import { sanityClient } from 'sanity:client';
import { EVENTS_QUERY } from '@lib/sanity/queries/eventsQuery';
// import { EventCategory } from '@content/taxonomies';
import { FeaturedImage } from '@content/schemaFragments/sanityComponents';
import { RichText } from '@content/schemaFragments/pageModules';
import type { SanityDocument } from '@sanity/client';
import { workspaces } from '@lib/sanity/workspaces';

export const events = defineCollection({
    loader: async () => {
        const events = await sanityClient.fetch<SanityDocument[]>(
            EVENTS_QUERY,
            {
                workspaceID: workspaces.pourdavoud.id,
            },
        );

        return events.map((event) => ({
            id: event._id,
            ...event,
        }));
    },

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
