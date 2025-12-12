import groq from 'groq';
import {
    FEATURED_IMAGE_PROJECTION,
    LINK_PROJECTION,
} from '@lib/sanity/groqFragments/commonProjections';
import { PERSON_RICH_TEXT_PROJECTION } from '@lib/sanity/groqFragments/moduleProjections';

export const PEOPLE_QUERY = groq`*[_type == "person" && $workspaceID in workspaces[]._ref] {
    _id,
    _type,
    "title": name.firstName + " " + name.lastName,
    "slug": slug.current,
    name,
    "affiliationType": type,
    "image": headshot ${FEATURED_IMAGE_PROJECTION},
    "internalRoles": coalesce(
        roles[] {
            _type,
            title,
            organization->{
                _id,
                title
            }
        },
        []
    ),
    department,
    institution,
    facultyTitle,
    facultyLink,
    "contact": {
        email,
    },
    "biography": coalesce(biography[] {
        ...,
        markDefs[] {
            ...,
            _type == "richTextLink" => ${LINK_PROJECTION}
        }
    }, []),
    showCV,
    showCV => {
        "cvSections": coalesce(cvSections[] {
            _key,
            _type,
            title,
            _type == "cvSection" => {
                richText {
                    ${PERSON_RICH_TEXT_PROJECTION}
                }
            },
            _type == "publicationList" => {
                publications[] {
                    "_id": _ref
                }
            }
        }, [])
    },
    "categories": coalesce(
        categories[]->{
            _id,
            _type,
            title,
            "slug": slug.current
        }
    )
}`;
