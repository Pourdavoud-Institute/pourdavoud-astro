import groq from 'groq';
import { LINK_PROJECTION } from '@lib/sanity/groqFragments/commonProjections';

export const PUBLICATIONS_QUERY = groq`*[_type == "publication" && $workspaceID in workspaces[]._ref] {
    _id,
    _type,
    title,
    subtitle,
    "slug": slug.current,
    type,
    "authors": coalesce(
        authors[] {
            _type,
            role,
            _type == "author" => {
                name
            },
            _type == "authorReference" => {
                reference->{
                    _id,
                    _type,
                    "slug": slug.current
                }
            }
        },
        []
    ),
    publisher,
    publicationDate,
    publicationLink, 
    citation,
    "image": featuredImage {
        asset->
    },
    "description": coalesce(description[] {
            ...,
            markDefs[] {
                ...,
                _type == "richTextLink" => ${LINK_PROJECTION}
            }
        }, []),
    "options": {
        createRoute
    }
}`;
