import type { CollectionEntry } from 'astro:content';

/** Splits a podcast title from the RSS feed, with an expected incoming string format of `Episode No.: Title`. */
export const splitPodcastTitle = (
    podcast: CollectionEntry<'podcast'>,
): { title: string; episode: string } => {
    let title = podcast.data.title;
    let episode = '';

    const parts = title.split(':');
    if (parts.length > 1) {
        episode = parts[0];
        title = parts[1];
    }

    return {
        title,
        episode,
    };
};
