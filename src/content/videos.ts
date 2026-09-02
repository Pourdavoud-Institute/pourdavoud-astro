import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { workspaces } from '@lib/sanity/workspaces';
import { VIDEOS_QUERY } from '@lib/sanity/queries/videosQuery';
import { PersonSpeaker } from '@content/schemaFragments/sanityComponents';
import { RichText } from '@content/schemaFragments/pageModules';
import { customSanityLoader } from '@lib/sanity/customSanityLoader';

const VideoEventFilter = z.object({
    _id: z.string(),
    _type: z.union([z.literal('event'), z.literal('eventCategory')]),
    title: z.string(),
    slug: z.string(),
    associatedSpeakers: z.array(z.any()).nullish(),
});

export type VideoEventFilter = z.infer<typeof VideoEventFilter>;

export const videos = defineCollection({
    loader: customSanityLoader({
        name: 'Videos',
        query: VIDEOS_QUERY,
        params: {
            workspaceID: workspaces.pourdavoud.id,
        },
    }),

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
