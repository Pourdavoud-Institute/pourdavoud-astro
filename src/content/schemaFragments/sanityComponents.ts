import { z } from 'astro:content';

/** Image */

const SanityImage = z.any();

export const FeaturedImage = z.object({
    asset: SanityImage,
    alt: z.string().optional(),
    caption: z.string().nullish(),
    crop: z.any().nullish(),
    hotspot: z.any().nullish(),
});

export type FeaturedImage = z.infer<typeof FeaturedImage>;

/** Link */
export const Link = z.object({
    type: z.enum(['internal', 'external', 'reference']),
    label: z.string().nullish(),
    target: z.boolean().optional(),
    href: z.string().nullish(),
    reference: z
        .object({
            _id: z.string(),
            slug: z.string(),
            title: z.string(),
        })
        .optional(),
});

export type Link = z.infer<typeof Link>;

/** Image Link */
export const ImageLink = z.object({
    type: z.enum(['internal', 'external', 'reference']),
    label: z.string().nullish(),
    target: z.boolean().optional(),
    href: z.string().nullish(),
    reference: z
        .object({
            _id: z.string(),
            slug: z.string(),
            title: z.string(),
        })
        .optional(),
    image: FeaturedImage,
});

export type ImageLink = z.infer<typeof ImageLink>;

/** Person Speaker Type */
export const PersonSpeaker = z.object({
    _id: z.string(),
    _type: z.literal('personSpeaker'),
    title: z.string(),
    slug: z.string(),
    name: z.object({
        firstName: z.string(),
        lastName: z.string(),
    }),
    institution: z.string().nullish(),
    associatedEvents: z.array(z.any()).nullish(),
});

export type PersonSpeaker = z.infer<typeof PersonSpeaker>;

export const RichTextBlocks = z.nullable(z.array(z.any()));

export type RichTextBlocks = z.infer<typeof RichTextBlocks>;

export const PageTemplate = z.enum([
    'default',
    'landing',
    'listing',
    'index',
    'eventsIndex',
    'info',
    'parent',
    'utility',
]);

export type PageTemplate = z.infer<typeof PageTemplate>;

export const SEOBlock = z
    .object({
        title: z.string().nullish(),
        description: z.string().nullish(),
    })
    .nullish();

export type SEOBlock = z.infer<typeof SEOBlock>;

export const OGBlock = z
    .object({
        title: z.string().nullish(),
        description: z.string().nullish(),
        image: z
            .object({
                asset: SanityImage,
            })
            .nullish(),
    })
    .nullish();

export type OGBlock = z.infer<typeof OGBlock>;

/** Formatted Text/Rich Text Lite */
// export const RichTextLite = z.object({
//     type: z.literal('block'),

// })
