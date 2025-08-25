import { formatEventDate, formatEventDetails } from '@lib/utils/formatEvent';
import type { CollectionEntry } from 'astro:content';

type Props = {
    event: CollectionEntry<'events'>;
};

export default function EventPreviewList({ event }: Props) {
    const eventDetails = formatEventDetails(event.data.details);
    const eventDatePreview = formatEventDate(event.data.details);
    return (
        <article class="event-preview-list" data-event-id={event.id}>
            <div class="text-wrapper | flow" data-tempo="allegro">
                <h3 class="title">
                    <a href={event.data.slug} class="title-link">
                        {event.data.title}
                    </a>
                </h3>
                <div class="details">
                    <span>
                        <strong>{eventDetails.date}</strong>
                    </span>
                    {eventDetails.time && <span>{eventDetails.time}</span>}
                    {eventDetails.location && (
                        <span>{eventDetails.location}</span>
                    )}
                </div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Non at consequuntur reiciendis dolorem quas ipsam.
                </p>
                {event.data.categories.length > 0 && (
                    <div class="tag">{event.data.categories[0].title}</div>
                )}
            </div>
            <a
                href={event.data.slug}
                class="image-wrapper | frame | image-scale-in"
            >
                <img
                    src="/images/pourdavoud-placeholder-landscape.webp"
                    width={800}
                    height={600}
                    alt=""
                />
                <div class="date-preview">
                    <span class="month">{eventDatePreview.month}</span>
                    <span class="day">{eventDatePreview.day}</span>
                </div>
            </a>
        </article>
    );
}
