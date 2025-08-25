import groq from 'groq';
import { LINK_PROJECTION } from '@lib/sanity/groqFragments/commonProjections';

export const NAVIGATION_QUERY = groq`*[_type == "navigation" && $workspaceID in workspaces[]._ref] {
    _id,
    _type,
    title,
    "items": items[] {
        "itemType": _type,
        _type == "link" => ${LINK_PROJECTION},
        _type == "linkList" => {
            label,
            "links": links[] ${LINK_PROJECTION}
        }
    }
}`;
