/** Helpers for converting Astro collection entries to format used in JSON feeds, e.g. `/events/index.json`. */
import { type CollectionEntry } from 'astro:content';
import { urlForImage } from '@lib/sanity/urlForImage';

/** Convert an event to a JSON feed item.
 * @param site Site domain, as set in Astro.site
 * @param event Event record
 * @param speakers Filtered speaker records linked to this event
 */
export function convertEventToJSON(
    site: string,
    event: CollectionEntry<'events'>,
    linkedSpeakers: CollectionEntry<'speakers'>[],
) {
    const { id, data } = event;
    return {
        id: id,
        title: data.title,
        slug: data.slug,
        uri: `${site}${data.slug}/`,
        details: data.details,
        featuredImage:
            data.image &&
            urlForImage(data.image)
                .width(1200)
                .height(800)
                .auto('format')
                .url(),
        thumbnailImage:
            data.image &&
            urlForImage(data.image).width(600).height(400).auto('format').url(),
        previewTitle: data.previewTitle,
        preview: data.preview,
        speakers: linkedSpeakers.map((speaker) => {
            const { id, data } = speaker;
            return {
                id: id,
                title: data.title,
                institution: data.institution,
                facultyLink: data.facultyLink,
                biography: data.biography,
                image:
                    data.image &&
                    urlForImage(data.image)
                        .width(200)
                        .height(200)
                        .auto('format')
                        .url(),
            };
        }),
        categories: data.categories.map((category) => ({
            id: category._id,
            title: category.title,
            slug: category.slug,
            uri: `${site}/events/categories${category.slug}/`,
        })),
        tags: data.tags.map((tag) => tag.title),
    };
}

/** Convert a post to a JSON feed item.
 * @param site Site domain, as set in Astro.site
 * @param event Post record
 */
export function convertPostToJSON(
    site: string,
    post: CollectionEntry<'posts'>,
) {
    const { id, data } = post;
    return {
        id: id,
        title: data.title,
        slug: data.slug,
        uri: `${site}${data.slug}/`,
        date: data.displayDate,
        featuredImage:
            data.image &&
            urlForImage(data.image)
                .width(1200)
                .height(800)
                .auto('format')
                .url(),
        thumbnailImage:
            data.image &&
            urlForImage(data.image).width(600).height(400).auto('format').url(),
        preview: data.preview,
        lede: data.lede,
        categories: data.categories.map((category) => ({
            id: category._id,
            title: category.title,
            slug: category.slug,
            uri: `${site}/news/categories${category.slug}/`,
        })),
    };
}
