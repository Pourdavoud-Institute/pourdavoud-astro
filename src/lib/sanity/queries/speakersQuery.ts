import groq from 'groq';
import {
    LINK_PROJECTION,
    FEATURED_IMAGE_PROJECTION,
} from '@lib/sanity/groqFragments/commonProjections';

export const SPEAKERS_QUERY = groq`*[_type == "personSpeaker" && $workspaceID in workspaces[]._ref] {
    _id,
    _type,
    "title": name.firstName + " " + name.lastName,
    "slug": slug.current,
    name,
    "image": headshot ${FEATURED_IMAGE_PROJECTION},
    institution,
    facultyLink,
    "biography": coalesce(biography[] {
        ...,
        markDefs[] {
            ...,
            _type == "richTextLink" => ${LINK_PROJECTION}
        }
    }, [])
}`;
