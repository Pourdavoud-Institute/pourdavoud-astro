import groq from 'groq';
import { FEATURED_IMAGE_PROJECTION } from '@lib/sanity/groqFragments/commonProjections';
import { RICH_TEXT_PROJECTION } from '@lib/sanity/groqFragments/moduleProjections';

export const ORGANIZATIONS_QUERY = groq`*[_type == "externalOrganization" && $workspaceID in workspaces[]._ref] {
    _id,
    _type,
    title,
    "slug": slug.current,
    url,
    preview,
    "image": featuredImage ${FEATURED_IMAGE_PROJECTION},
    richText {
        _type,
        ${RICH_TEXT_PROJECTION}
    },
}`;
