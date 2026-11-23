import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isUpcoming } from '@lib/utils/isUpcoming';
import { sortUpcoming } from '@lib/utils/sortEvents';
import { convertEventToJSON } from '@lib/utils/convertCollectionToJSON';

const events = await getCollection('events', ({ data }) =>
    isUpcoming(data.details.startDate),
);
const speakers = await getCollection('speakers');

/** Return preview(?) fields for upcoming events, sorted by closest to today. For archived events (past 6 months), see `/events/archive/index.json.ts`. */
export const GET = ((ctx) => {
    const site = ctx.site!.origin;
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Response(
        JSON.stringify({
            title: 'Pourdavoud Institute Upcoming Events',
            description:
                'Upcoming events programmed by the Pourdavoud Institute, sorted by nearest to today to future start date.',
            url: `${site}/events/`,
            items: sortUpcoming(events).map((event) => {
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
