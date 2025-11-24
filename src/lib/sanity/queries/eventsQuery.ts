import groq from 'groq';
import { FEATURED_IMAGE_PROJECTION } from '@lib/sanity/groqFragments/commonProjections';
import { RICH_TEXT_PROJECTION } from '@lib/sanity/groqFragments/moduleProjections';

export const EVENTS_QUERY = groq`*[_type == "event" && $workspaceID in workspaces[]._ref] | order(eventDetails.date.startDate asc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    "details": eventDetails {
        "startDate": date.startDate,
        multiDay,
        multiDay == true => {
            "endDate": date.endDate
        },
        multiDay == false => {
            "startTime": time.startTime,
            "endTime": time.endTime
        },
        location,
        rsvpLink
    },
    previewTitle,
    preview,
    "image": featuredImage ${FEATURED_IMAGE_PROJECTION},
    richText {
        _type,
        ${RICH_TEXT_PROJECTION}
    },
    "speakersRef": coalesce(
        speakersRef[]-> {
            _id,
            _type,
            "slug": slug.current,
        },
        []
    ),
    "place": coalesce(
        placeRef[] {
            name,
            location-> {
                streetAddress,
                extendedAddress,
                addressLocality,
                addressRegion,
                postalCode,
                addressCountry,
            },
        },
        []
    ),
    "videos": *[_type == "video" && references(^._id) && $workspaceID in workspaces[]._ref] {
        _id,
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
