/** Utilities for video library previews and Vue components. */
import getYouTubeID from 'get-youtube-id';
import type { CollectionEntry } from 'astro:content';

/** Dictionary for valid video URL search params - use values for setting param keys.
 * @example params.get(vParams.sort);
 */
export const videoSearchParams = {
    sort: 'sort',
    search: 'q',
    event: 'event',
    speaker: 'speaker',
    view: 'view',
    paginate: 'offset',
};

/** Helper to get the high-res thumbnail image from a YouTube video URL.
 * @param url URL to extract YouTube ID
 */
export function getYoutubeThumbnail(url: string): string {
    const id = getYouTubeID(url);
    if (id) {
        return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }

    // todo: return fallback image
    return '';
}

/** Helper to get the name of the event or event category attached as the first reference on a video. */
export function getVideoEventTitle(
    video: CollectionEntry<'videos'>,
): string | undefined {
    // get first referenced event filter
    if (video.data.eventFiltersRef.length > 0) {
        const event = video.data.eventFiltersRef[0];

        if (event._type === 'event') {
            return `Part of “${event.title}”`;
        }

        return event.title;
    }

    return undefined;
}

/** Helper to check for speakers attached as references on a video and return as list. */
export function getVideoSpeakersList(
    video: CollectionEntry<'videos'>,
): CollectionEntry<'videos'>['data']['speakersRef'] | undefined {
    if (video.data.speakersRef.length > 0) {
        return video.data.speakersRef;
    }

    return undefined;
}

/** Helper to delay updating value on input.
 * @link https://www.joshwcomeau.com/snippets/javascript/debounce/
 */
export function debounce(fn: any, wait?: number) {
    let timeoutId: number | undefined = undefined;

    return (...args: any) => {
        window.clearTimeout(timeoutId);

        timeoutId = window.setTimeout(() => {
            fn.apply(null, args);
        }, wait ?? 250);
    };
}
