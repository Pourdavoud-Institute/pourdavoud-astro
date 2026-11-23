import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isBefore } from '@formkit/tempo';
import { convertPostToJSON } from '@lib/utils/convertCollectionToJSON';

const posts = await getCollection('posts');

/** Return preview(?) fields for news collection, sorted most recent to oldest (capped at limit). */
export const GET = ((ctx) => {
    const site = ctx.site!.origin;
    const limit = 25;
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Response(
        JSON.stringify({
            title: 'Pourdavoud Institute Latest News',
            description: `News and announcements from the Pourdavoud Institute posts feed (limit ${limit}).`,
            url: `${site}/news/`,
            items: posts
                .sort((a, b) =>
                    isBefore(a.data.displayDate, b.data.displayDate) ? 1 : -1,
                )
                .slice(0, limit)
                .map((post) => convertPostToJSON(site, post)),
        }),
        options,
    );
}) satisfies APIRoute;
