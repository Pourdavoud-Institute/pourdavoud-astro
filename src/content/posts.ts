import { defineCollection, z } from 'astro:content';
import { sanityClient } from 'sanity:client';
import { POSTS_QUERY } from '@lib/sanity/queries/postsQuery';
import type { SanityDocument } from '@sanity/client';
import { RichText } from '@content/schemaFragments/pageModules';
import { FeaturedImage } from '@content/schemaFragments/sanityComponents';
import { workspaces } from '@lib/sanity/workspaces';

export const posts = defineCollection({
    loader: async () => {
        const posts = await sanityClient.fetch<SanityDocument[]>(POSTS_QUERY, {
            workspaceID: workspaces.pourdavoud.id,
        });

        return posts.map((post) => ({
            id: post._id,
            ...post,
        }));
    },

    schema: z.object({
        _id: z.string(),
        _type: z.literal('post'),
        _updatedAt: z.string(),
        title: z.string(),
        slug: z.string(),
        displayDate: z.string(),
        preview: z.nullable(z.array(z.any())),
        image: FeaturedImage.nullish(),
        lede: z.nullable(z.array(z.any())),
        richText: RichText.nullish(),
        categories: z.array(
            z.object({
                _id: z.string(),
                _type: z.literal('postCategory'),
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
