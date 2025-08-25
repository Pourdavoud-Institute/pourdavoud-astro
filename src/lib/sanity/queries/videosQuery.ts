import groq from 'groq';
import { RICH_TEXT_PROJECTION } from '@lib/sanity/groqFragments/moduleProjections';

export const VIDEOS_QUERY = groq`*[_type == "video" && $workspaceID in workspaces[]._ref] {
    _id,
    _type,
    title,
    "slug": slug.current,
    preview,
    date,
    url,
    citation,
    richText {
        _type,
        ${RICH_TEXT_PROJECTION}
    },
    "eventReference": coalesce(
        reference[]-> {
            _id,
            _type,
            "slug": slug.current
        },
        []
    ),
    "eventFiltersRef": coalesce(
        referenceFilter[]-> {
            _id,
            _type,
            "title": coalesce(previewTitle, title),
            "slug": slug.current
        },
        []
    ),
    "speakersRef": coalesce(
        speakersRef[]-> {
            _id,
            _type,
            "title": name.firstName + " " + name.lastName,
            "slug": slug.current,
            name,
            institution,
        },
        []
    )
}`;
