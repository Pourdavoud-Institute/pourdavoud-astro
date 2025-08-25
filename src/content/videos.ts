import { defineCollection, z } from 'astro:content';
import { sanityClient } from 'sanity:client';
import type { SanityDocument } from '@sanity/client';
import { workspaces } from '@lib/sanity/workspaces';
import { VIDEOS_QUERY } from '@lib/sanity/queries/videosQuery';
import { PersonSpeaker } from '@content/schemaFragments/sanityComponents';
import { RichText } from '@content/schemaFragments/pageModules';

const VideoEventFilter = z.object({
    _id: z.string(),
    _type: z.union([z.literal('event'), z.literal('eventCategory')]),
    title: z.string(),
    slug: z.string(),
    associatedSpeakers: z.array(z.any()).nullish(),
});

export type VideoEventFilter = z.infer<typeof VideoEventFilter>;

export const videos = defineCollection({
    loader: async () => {
        const videos = await sanityClient.fetch<SanityDocument[]>(
            VIDEOS_QUERY,
            {
                workspaceID: workspaces.pourdavoud.id,
            },
        );

        return videos.map((video) => ({
            id: video._id,
            ...video,
        }));
    },

    schema: z.object({
        _id: z.string(),
        _type: z.literal('video'),
        title: z.string(),
        slug: z.string(),
        preview: z.nullable(z.array(z.any())),
        date: z.string(),
        url: z.string(),
        richText: RichText.nullish(),
        citation: z.string().nullish(),
        eventReference: z.array(
            z.object({
                _id: z.string(),
                _type: z.literal('event'),
                slug: z.string(),
            }),
        ),
        eventFiltersRef: z.array(VideoEventFilter),
        speakersRef: z.array(PersonSpeaker),
    }),
});
