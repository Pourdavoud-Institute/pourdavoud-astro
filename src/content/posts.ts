import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { POSTS_QUERY } from '@lib/sanity/queries/postsQuery';
import { RichText } from '@content/schemaFragments/pageModules';
import { FeaturedImage } from '@content/schemaFragments/sanityComponents';
import { workspaces } from '@lib/sanity/workspaces';
import { customSanityLoader } from '@lib/sanity/customSanityLoader';

export const posts = defineCollection({
    loader: customSanityLoader({
        name: 'Posts',
        query: POSTS_QUERY,
        params: {
            workspaceID: workspaces.pourdavoud.id,
        },
    }),

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
