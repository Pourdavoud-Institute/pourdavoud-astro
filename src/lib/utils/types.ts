import type {
    SanityImageAsset,
    SanityImageCrop,
    SanityImageHotspot,
} from '@lib/sanity/sanity.types';
import { PageTemplate } from '@content/schemaFragments/sanityComponents';

/** Custom image type to match expanded Sanity reference from GROQ query */
export type SanityImage = {
    asset?: SanityImageAsset;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string | null;
    caption?: string | null;
};

/** Background color style of breadcrumbs to match featured navigation */
export type BreadcrumbsStyle =
    | 'default'
    | 'lighter'
    | 'primary'
    | 'darker'
    | 'darkest';
export type BreadcrumbsCollection =
    | 'events'
    | 'eventCategories'
    | 'pages'
    | 'people'
    | 'posts'
    | 'postCategories'
    | 'publications'
    | 'videos';

type ExpandedPageTemplate =
    | typeof PageTemplate
    | 'eventsShow'
    | 'postsShow'
    | 'videosShow';

/** Custom page type applicable across many collection types, for use in PageWrapper and meta */
export type Page = {
    id: string;
    data: {
        template: ExpandedPageTemplate;
        options?: {
            footerMargin?: boolean | null;
        };
    };
};
