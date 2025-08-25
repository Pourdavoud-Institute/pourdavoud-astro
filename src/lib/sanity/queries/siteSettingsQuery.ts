import groq from 'groq';
import {
    OPEN_GRAPH_PROJECTION,
    SEO_PROJECTION,
} from '@lib/sanity/groqFragments/commonProjections';

export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettingsPourdavoud"] {
    _id,
    _type,
    siteName,
    siteDomain,
    seo ${SEO_PROJECTION},
    openGraph ${OPEN_GRAPH_PROJECTION}
}`;
