import groq from 'groq';
import { FEATURED_IMAGE_PROJECTION } from '@lib/sanity/groqFragments/commonProjections';
import { RICH_TEXT_PROJECTION } from '@lib/sanity/groqFragments/moduleProjections';

export const POSTS_QUERY = groq`*[_type == "post" && $workspaceID in workspaces[]._ref] | order(displayDate desc) {
    _id,
    _type,
    _updatedAt,
    title,
    "slug": slug.current,
    displayDate,
    preview,
    "image": featuredImage ${FEATURED_IMAGE_PROJECTION},
    lede,
    richText {
        _type,
        ${RICH_TEXT_PROJECTION}
    },
    "categories": coalesce(
        categories[]->{
            _id,
            _type,
            title,
            "slug": slug.current
        },
        []
    ),
    "tags": coalesce(
        tags[]->{
            _type,
            title,
            "slug": slug.current
        } | order(title asc),
        []
    )
}`;
