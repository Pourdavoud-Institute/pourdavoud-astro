import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isBefore } from '@formkit/tempo';
import { convertEventToJSON } from '@lib/utils/convertCollectionToJSON';

const now = new Date();
const events = await getCollection('events', ({ data }) =>
    isBefore(data.details.startDate, now),
);
const speakers = await getCollection('speakers');

/** Return preview(?) fields for archived/past events (capped at limit), sorted newest to oldest. */
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
            title: 'Pourdavoud Institute Archived Events',
            description: `Recent past events programmed by the Pourdavoud Institute, sorted by newest to oldest (limit ${limit}).`,
            url: `${site}/events/archive/1/`,
            items: events
                .sort((a, b) =>
                    isBefore(a.data.details.startDate, b.data.details.startDate)
                        ? 1
                        : -1,
                )
                .slice(0, limit)
                .map((event) => {
                    const speakersRef = event.data.speakersRef.map(
                        (ref) => ref._id,
                    );
                    const linkedSpeakers = speakers.filter((s) =>
                        speakersRef.includes(s.id),
                    );
                    return convertEventToJSON(site, event, linkedSpeakers);
                }),
        }),
        options,
    );
}) satisfies APIRoute;
