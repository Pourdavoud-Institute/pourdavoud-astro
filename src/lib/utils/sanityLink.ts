import type { Link } from '@content/schemaFragments/sanityComponents';

export type SanityLinkParts = {
    label: string;
    url: string;
    target: '_self' | '_blank';
};

/** Generate link parts from a Sanity link object.
 * @param linkObject Sanity link object
 * @returns Object of link parts
 */
export const sanityLink = (linkObject: Link): SanityLinkParts => {
    let url = undefined;
    let label = '';
    let target: '_self' | '_blank' = '_self';

    switch (linkObject.type) {
        case 'reference':
            url = linkObject.reference?.slug as string;
            label =
                linkObject.label ??
                (linkObject.reference?.title as string) ??
                '';
            break;
        default:
            url = linkObject.href as string;
            label = (linkObject.label as string) ?? '';
            break;
    }

    if (linkObject.type === 'external' && linkObject.target) {
        target = '_blank';
    }

    if (url === '/home' || url === undefined) {
        url = '/';
    }

    /* TODO: Sanitize href */

    return {
        label,
        url,
        target,
    };
};
