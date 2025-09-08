import groq from 'groq';
import {
    FEATURED_IMAGE_PROJECTION,
    OPEN_GRAPH_PROJECTION,
    SEO_PROJECTION,
} from '@lib/sanity/groqFragments/commonProjections';
import {
    CARD_LIST_PROJECTION,
    COLLECTION_LIST_PROJECTION,
    COLUMNS_GROUP_PROJECTION,
    DISCLOSURE_SET_PROJECTION,
    EVENTS_PREVIEW_LIST_PROJECTION,
    FEATURED_ELEMENT_PROJECTION,
    GALLERY_PROJECTION,
    HERO_BANNER_PROJECTION,
    HERO_COVER_PROJECTION,
    PODCAST_FEED_PROJECTION,
    POSTS_LIST_PROJECTION,
    PEOPLE_LIST_PROJECTION,
    PUBLICATIONS_LIST_PROJECTION,
    RELATED_LINKS_PROJECTION,
    RICH_TEXT_PROJECTION,
    TWO_COLUMN_TEXT_PROJECTION,
} from '@lib/sanity/groqFragments/moduleProjections';

export const PAGES_QUERY = groq`*[_type == "page" && $workspaceID in workspaces[]._ref] {
    _id,
    _type,
    title,
    "slug": slug.current,
    "parent": parent[0]->{
        title,
        "slug": slug.current
    },
    template,
    indexCollection,
    "header": pageHeader {
        preview,
        layout,
        "image": featuredImage ${FEATURED_IMAGE_PROJECTION}
    },
    "modules": coalesce([...modules_landing[], ...modules_default[], ...modules_information[]] {
        _type,
        ${CARD_LIST_PROJECTION},
        ${COLLECTION_LIST_PROJECTION},
        ${COLUMNS_GROUP_PROJECTION},
        ${DISCLOSURE_SET_PROJECTION},
        ${EVENTS_PREVIEW_LIST_PROJECTION},
        ${FEATURED_ELEMENT_PROJECTION},
        ${GALLERY_PROJECTION},
        ${HERO_BANNER_PROJECTION},
        ${HERO_COVER_PROJECTION},
        ${PEOPLE_LIST_PROJECTION},
        ${PODCAST_FEED_PROJECTION},
        ${POSTS_LIST_PROJECTION},
        ${PUBLICATIONS_LIST_PROJECTION},
        ${RELATED_LINKS_PROJECTION},
        ${RICH_TEXT_PROJECTION},
        ${TWO_COLUMN_TEXT_PROJECTION}
    }, []),
    "options": {
        layout,
        footerMargin
    },
    seo ${SEO_PROJECTION},
    openGraph ${OPEN_GRAPH_PROJECTION}
}`;
