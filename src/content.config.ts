/** Zod optional vs null
 * @link https://gist.github.com/ciiqr/ee19e9ff3bb603f8c42b00f5ad8c551e
 */
import { events } from '@content/events';
import { navigation } from '@content/navigation';
import { pages } from '@content/pages';
import { people } from '@content/people';
import { podcast } from '@content/podcast';
import { posts } from '@content/posts';
import { publications } from '@content/publications';
import { settings } from '@content/settings';
import { speakers } from '@content/people';
import { videos } from '@content/videos';
import { eventCategories, postCategories } from '@content/taxonomies';

export const collections = {
    events,
    eventCategories,
    navigation,
    pages,
    people,
    podcast,
    posts,
    postCategories,
    publications,
    settings,
    speakers,
    videos,
};
