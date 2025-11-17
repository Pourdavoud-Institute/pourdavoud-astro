/* Corresponding to page module schema types in Sanity */
import groq from 'groq';
import {
    FEATURED_IMAGE_PROJECTION,
    LINK_PROJECTION,
    IMAGE_LINK_PROJECTION,
    SPEAKER_PROJECTION,
} from '@lib/sanity/groqFragments/commonProjections.js';

export const HERO_BANNER_PROJECTION = groq`_type == "heroBanner" => {
    heading,
    subheading,
    "image": featuredImage ${FEATURED_IMAGE_PROJECTION},
    "cta": coalesce(
        cta[] ${LINK_PROJECTION},
        []
    )
}`;

export const HERO_COVER_PROJECTION = groq`_type == "heroCover" => {
    heading,
    "image": featuredImage ${FEATURED_IMAGE_PROJECTION},
    "cta": coalesce(
        cta[] ${LINK_PROJECTION},
        []
    )
}`;

export const FEATURED_ELEMENT_PROJECTION = groq`_type == "featuredElement" => {
    eyebrow,
    heading,
    "image": featuredImage ${FEATURED_IMAGE_PROJECTION},
    preview,
    "cta": coalesce(
        cta[] ${LINK_PROJECTION},
        []
    ),
    "options": {
        backgroundColor,
        sectionMargin,
        imagePosition,
        imageAspectRatio
    }
}`;

export const COLLECTION_LIST_PROJECTION = groq`_type == "collectionList" => {
    heading,
    collection,
    customSelection == true => {
        "collectionEntries": coalesce(
            collectionEntries[]->{
                _id
            },
            []
        )
    },
    "cta": coalesce(
        cta[] ${LINK_PROJECTION},
        []
    ),
    "options": {
        displayCount,
        customSelection,
        columns,
        sectionMargin
    }
}`;

export const COLUMNS_GROUP_PROJECTION = groq`_type == "columnsGroup" => {
    "columns": coalesce(
        columns[] {
            heading,
            text,
            "cta": coalesce(
                cta[] ${LINK_PROJECTION},
                []
            ),
        },
        []
    ),
    "options": {
        sectionMargin,
        columnsAlign
    }
}`;

export const GALLERY_PROJECTION = groq`_type == "gallery" => {
    heading,
    "images": coalesce(
        images[] ${FEATURED_IMAGE_PROJECTION},
        []
    ),
    "options": {
        sectionMargin,
    }
}`;

export const POSTS_LIST_PROJECTION = groq`_type == "postsList" => {
    heading,
    selection,
    "options": {
        gridColumns,
        sectionMargin
    }
}`;

export const PEOPLE_LIST_PROJECTION = groq`_type == "peopleList" => {
    heading,
    selection,
    filter,
    selection == "manual" => {
        "entries": coalesce(
            entries[]->{
                _id,
                _type,
                "slug": slug.current
            },
            []
        )
    },
    "options": {
        gridColumns,
        gridDensity,
        linkToPages,
        sectionMargin,
        layout
    }
}`;

export const PODCAST_FEED_PROJECTION = groq`_type == "podcastFeed" => {
    heading,
    "options": {
        sectionMargin
    }
}`;

export const PUBLICATIONS_LIST_PROJECTION = groq`_type == "publicationsList" => {
    heading,
    preview,
    "entries": coalesce(
        entries[]->{
            _id,
            _type,
            "slug": slug.current
        },
        []
    ),
    "options": {
        sectionMargin
    }
}`;

export const EVENTS_PREVIEW_LIST_PROJECTION = groq`_type == "eventsPreviewList" => {
    showUpcoming,
    showPast,
    "options": {
        sectionMargin
    }
}`;

export const CARD_LIST_PROJECTION = groq`_type == "cardList" => {
    heading,
    cards[] {
        _type,
        _type == "card" => {
            heading,
            preview,
            "image": featuredImage ${FEATURED_IMAGE_PROJECTION},
            "cta": coalesce(
                cta[] ${LINK_PROJECTION},
                []
            )
        }
    },
    "options": {
        sectionMargin
    }
}`;

export const DISCLOSURE_SET_PROJECTION = groq`_type == "disclosureSet" => {
    heading,
    preview,
    items[] {
        heading,
        "blocks": body[] {
            ...,
            markDefs[] {
                ...,
                _type == "richTextLink" => ${LINK_PROJECTION}
            }
        }
    },
    "options": {
        sectionMargin
    }
}`;

export const RELATED_LINKS_PROJECTION = groq`_type == "relatedLinks" => {
    heading,
    links[] ${IMAGE_LINK_PROJECTION},
    "options": {
        sectionMargin
    }
}`;

export const RICH_TEXT_PROJECTION = groq`_type == "richText" => {
    blocks[] {
        ...,
        _type == "richTextImage" => {
            ...,
            "asset": asset->
        },
        _type == "speaker" => ${SPEAKER_PROJECTION},
        _type == "linkGroup" => {
            links[] ${LINK_PROJECTION}
        },
        markDefs[] {
            ...,
            _type == "richTextLink" => ${LINK_PROJECTION}
        }
    },
    "options": {
        sectionMargin
    }
}`;

export const PERSON_RICH_TEXT_PROJECTION = groq`_type == "personRichText" => {
    blocks[] {
        ...,
        _type == "richTextImage" => {
            ...,
            "asset": asset->
        },
        markDefs[] {
            ...,
            _type == "richTextLink" => ${LINK_PROJECTION}
        }
    }
}`;

export const TWO_COLUMN_TEXT_PROJECTION = groq`_type == "twoColumnText" => {
   heading,
   richText {
        _type,
        ${RICH_TEXT_PROJECTION}
   },
    "options": {
        backgroundColor,
        sectionMargin
    }
}`;
