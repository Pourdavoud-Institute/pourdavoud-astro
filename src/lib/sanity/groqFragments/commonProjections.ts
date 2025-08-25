import groq from 'groq';

/* Most of these correspond to object schema types in Sanity */
export const FEATURED_IMAGE_PROJECTION = groq`{
    asset->,
    alt,
    caption,
    crop,
    hotspot
}`;

export const LINK_PROJECTION = groq`{
    type,
    label,
    type == "reference" => {
        reference-> {
            _id,
            "slug": slug.current,
            _type == "page" || _type == "event" => {
                title,
            },
            _type == "person" => {
                "title": name.firstName + " " + name.lastName,
            },
        }
    },
    type == "internal" => {
        "href": internal
    },
    type == "external" => {
        "href": external,
        target
    }
}`;

export const IMAGE_LINK_PROJECTION = groq`{
    type,
    label,
    "image": featuredImage ${FEATURED_IMAGE_PROJECTION},
    type == "reference" => {
        reference-> {
            _id,
            "slug": slug.current,
            _type == "page" => {
                title,
            },
            _type == "person" => {
                "title": name.firstName + " " + name.lastName,
            }
        }
    },
    type == "internal" => {
        "href": internal
    },
    type == "external" => {
        "href": external,
        target
    }
}`;

export const SPEAKER_PROJECTION = groq`{
    _type,
    "speaker": {
        name,
        title,
        institution,
        "image": featuredImage ${FEATURED_IMAGE_PROJECTION},
        about,
        link
    }
}`;

export const SEO_PROJECTION = groq`{
    title,
    description
}`;

export const OPEN_GRAPH_PROJECTION = groq`{
    title,
    description,
    image {
        ...,
        asset->
    }
}`;
