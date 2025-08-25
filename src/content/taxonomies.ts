import { defineCollection, z } from 'astro:content';
import { sanityClient } from 'sanity:client';
import {
    EVENT_CATEGORIES_QUERY,
    POST_CATEGORIES_QUERY,
} from '@lib/sanity/queries/taxonomyQueries';
import type { SanityDocument } from '@sanity/client';
import { workspaces } from '@lib/sanity/workspaces';

export const EventCategory = z.object({
    _id: z.string(),
    _type: z.literal('eventCategory'),
    title: z.string(),
    slug: z.string(),
    events: z.array(
        z.object({
            _id: z.string(),
        }),
    ),
});

export type EventCategory = z.infer<typeof EventCategory>;

export const eventCategories = defineCollection({
    loader: async () => {
        const eventCategories = await sanityClient.fetch<SanityDocument[]>(
            EVENT_CATEGORIES_QUERY,
            {
                workspaceID: workspaces.pourdavoud.id,
            },
        );

        return eventCategories.map((category) => ({
            id: category._id,
            ...category,
        }));
    },

    schema: EventCategory,
});

export const PostCategory = z.object({
    _id: z.string(),
    _type: z.literal('postCategory'),
    title: z.string(),
    slug: z.string(),
    posts: z.array(
        z.object({
            _id: z.string(),
        }),
    ),
});

export const postCategories = defineCollection({
    loader: async () => {
        const postCategories = await sanityClient.fetch<SanityDocument[]>(
            POST_CATEGORIES_QUERY,
            {
                workspaceID: workspaces.pourdavoud.id,
            },
        );

        return postCategories.map((category) => ({
            id: category._id,
            ...category,
        }));
    },

    schema: PostCategory,
});
