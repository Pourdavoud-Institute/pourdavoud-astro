import { z } from 'astro:content';
import {
    FeaturedImage,
    Link,
    ImageLink,
    RichTextBlocks,
} from '@content/schemaFragments/sanityComponents';
import { SanityPeopleCategories as categories } from '@lib/sanity/dicts';

/** CARD LIST */
const CardList = z.object({
    _type: z.literal('cardList'),
    heading: z.string(),
    cards: z
        .array(
            z.object({
                heading: z.string(),
                preview: z.nullable(z.array(z.any())),
                image: FeaturedImage.optional(),
                cta: z.array(Link),
            }),
        )
        .optional(),
    options: z.object({
        sectionMargin: z.boolean().nullish(),
    }),
});

export type CardList = z.infer<typeof CardList>;

/** COLLECTION LIST */
const CollectionList = z.object({
    _type: z.literal('collectionList'),
    heading: z.string(),
    collection: z.union([
        z.literal('post'),
        z.literal('event'),
        z.literal('video'),
    ]),
    options: z.object({
        sectionMargin: z.boolean().nullish(),
    }),
});

export type CollectionList = z.infer<typeof CollectionList>;

/** COLUMNS GROUP */
const ColumnsGroup = z.object({
    _type: z.literal('columnsGroup'),
    columns: z.array(
        z.object({
            heading: z.string(),
            text: z.nullable(z.array(z.any())),
            cta: z.array(Link).nullish(),
        }),
    ),
    options: z.object({
        sectionMargin: z.boolean().nullish(),
        columnsAlign: z.enum(['default', 'center']).nullish(),
    }),
});

export type ColumnsGroup = z.infer<typeof ColumnsGroup>;

/** PEOPLE LIST */
const PeopleList = z.object({
    _type: z.literal('peopleList'),
    heading: z.string().nullish(),
    selection: z.union([z.literal('auto'), z.literal('manual')]),
    // people category IDs
    filter: z.enum([
        'all',
        categories.staff.id,
        categories.faculty.id,
        categories.affiliate.id,
        categories.gradStudent.id,
    ]),
    // filter: z.union([
    //     z.literal('all'),
    //     // z.literal('c1521379-8de4-4b5d-9e0f-5765f2a4d62e'),
    //     // z.literal('c852a954-828d-4d81-8c1e-39299b23e5a7'),
    //     // z.literal('cae812fd-2c96-437c-9c75-8b3a04307be5'),
    //     // z.literal('226fe6c7-8fcf-4f83-a69c-6bd83c4a00fd'),
    // ]),
    entries: z.array(
        z.object({
            _id: z.string(),
            _type: z.literal('person'),
            slug: z.string(),
        }),
    ),
    options: z.object({
        gridColumns: z.number().nullish(),
        gridDensity: z.enum(['default', 'compact']).nullish(),
        linkToPages: z.boolean().nullish(),
        layout: z.enum(['image', 'no-image']).nullish(),
        sectionMargin: z.boolean().nullish(),
    }),
});

export type PeopleList = z.infer<typeof PeopleList>;

/** PODCAST FEED */
const PodcastFeed = z.object({
    _type: z.literal('podcastFeed'),
    heading: z.string(),
    options: z.object({
        sectionMargin: z.boolean().nullish(),
    }),
});

export type PodcastFeed = z.infer<typeof PodcastFeed>;

/** POSTS LIST */
const PostsList = z.object({
    _type: z.literal('postsList'),
    heading: z.string().nullish(),
    selection: z.union([z.literal('auto'), z.literal('manual')]),
    options: z.object({
        gridColumns: z.number().nullish(),
        sectionMargin: z.boolean().nullish(),
    }),
});

export type PostsList = z.infer<typeof PostsList>;

/** PUBLICATIONS LIST */
const PublicationsList = z.object({
    _type: z.literal('publicationsList'),
    heading: z.string().nullish(),
    preview: z.nullable(z.array(z.any())),
    entries: z.array(
        z.object({
            _id: z.string(),
            _type: z.literal('publication'),
            slug: z.string(),
        }),
    ),
    options: z.object({
        sectionMargin: z.boolean().nullish(),
    }),
});

export type PublicationsList = z.infer<typeof PublicationsList>;

/** DISCLOSURE SET */
const DisclosureSet = z.object({
    _type: z.literal('disclosureSet'),
    heading: z.string(),
    preview: RichTextBlocks,
    items: z.array(
        z.object({
            heading: z.string(),
            blocks: RichTextBlocks,
        }),
    ),
    options: z.object({
        sectionMargin: z.boolean().nullish(),
    }),
});

export type DisclosureSet = z.infer<typeof DisclosureSet>;

/** EVENTS PREVIEW LIST */
const EventsPreviewList = z.object({
    _type: z.literal('eventsPreviewList'),
    showUpcoming: z.boolean(),
    showPast: z.boolean(),
    options: z.object({
        sectionMargin: z.boolean().nullish(),
    }),
});

export type EventsPreviewList = z.infer<typeof EventsPreviewList>;

/** FEATURED ELEMENT */
const FeaturedElement = z.object({
    _type: z.literal('featuredElement'),
    eyebrow: z.string().nullish(),
    heading: z.string(),
    image: FeaturedImage,
    preview: z.nullable(z.array(z.any())),
    cta: z.array(Link),
    options: z.object({
        backgroundColor: z.boolean().nullish(),
        sectionMargin: z.boolean().nullish(),
        imagePosition: z.enum(['right', 'left']).nullish(),
        imageAspectRatio: z
            .enum(['default', '3/4', '2/3', '1/1', '3/2', '4/3', '16/9'])
            .nullish(),
    }),
});

export type FeaturedElement = z.infer<typeof FeaturedElement>;

/** IMAGE GALLERY */
const Gallery = z.object({
    _type: z.literal('gallery'),
    heading: z.string().nullable(),
    images: z.array(FeaturedImage),
    options: z.object({
        sectionMargin: z.boolean().nullish(),
    }),
});

export type Gallery = z.infer<typeof Gallery>;

/** HERO BANNER */
const HeroBanner = z.object({
    _type: z.literal('heroBanner'),
});

export type HeroBanner = z.infer<typeof HeroBanner>;

/** HERO COVER */
const HeroCover = z.object({
    _type: z.literal('heroCover'),
    heading: z.string(),
    image: FeaturedImage,
    cta: z.array(Link.optional()),
});

export type HeroCover = z.infer<typeof HeroCover>;

/** RELATED LINKS */
const RelatedLinks = z.object({
    _type: z.literal('relatedLinks'),
    heading: z.string().optional(),
    links: z.array(ImageLink),
    options: z.object({
        sectionMargin: z.boolean().nullish(),
    }),
});

export type RelatedLinks = z.infer<typeof RelatedLinks>;

/** RICH TEXT */
export const RichText = z.object({
    _type: z.literal('richText'),
    blocks: RichTextBlocks,
    options: z.object({
        sectionMargin: z.boolean().nullish(),
    }),
});

export type RichText = z.infer<typeof RichText>;

/** TWO COLUMN TEXT */
const TwoColumnText = z.object({
    _type: z.literal('twoColumnText'),
    heading: z.string(),
    richText: RichText.nullish(),
    options: z.object({
        backgroundColor: z.boolean().nullish(),
        sectionMargin: z.boolean().nullish(),
    }),
});

export type TwoColumnText = z.infer<typeof TwoColumnText>;

/** Union type to use in page modules key */
export const PageModules = z.array(
    z.union([
        CardList,
        CollectionList,
        ColumnsGroup,
        DisclosureSet,
        EventsPreviewList,
        FeaturedElement,
        Gallery,
        HeroBanner,
        HeroCover,
        PeopleList,
        PodcastFeed,
        PostsList,
        PublicationsList,
        RelatedLinks,
        RichText,
        TwoColumnText,
    ]),
);
