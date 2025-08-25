import type { BreadcrumbsStyle } from './types';

/** Helper function to match breadcrumbs background style to featured navigation theme color.
 * @param slug Slug string from a Sanity page, i.e. `/research`
 * @returns Breadcrumbs style based to match navigation theme color
 */
export const getBreadcrumbsStyleFromSlug = (slug: string): BreadcrumbsStyle => {
    const slugParts = slug.split('/').filter(Boolean);

    switch (slugParts[0]) {
        case 'events':
            return 'lighter';
        case 'research':
            return 'primary';
        case 'publications':
            return 'darker';
        case 'media':
            return 'darkest';
        default:
            return 'default';
    }
};
