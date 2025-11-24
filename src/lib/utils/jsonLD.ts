import { type CollectionEntry } from 'astro:content';
import { urlForImage } from '@lib/sanity/urlForImage';

export const eventStructuredData = (
    event: CollectionEntry<'events'>,
): Record<string, any> => {
    let image = undefined;
    if (event.data.image) {
        image = urlForImage(event.data.image)
            .auto('format')
            .fit('crop')
            .crop('focalpoint');
    }

    // already checked for length
    const place = event.data.place[0];

    const schema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'Event', // required
        name: event.data.title, // required
        startDate: event.data.details.startDate, // required
        // endDate: '', // recommended if multi-day
        eventStatus: 'https://schema.org/EventScheduled', // recommended
        location: {
            '@type': 'Place',
            name: place.name, // recommended
            address: {
                '@type': 'PostalAddress',
                extendedAddress: place.location.extendedAddress ?? '',
                streetAddress: place.location.streetAddress,
                addressLocality: place.location.addressLocality,
                addressRegion: place.location.addressRegion,
                postalCode: place.location.postalCode,
                addressCountry: place.location.addressCountry,
            }, // required
        }, // required
        // image: [], // recommended
        // description: '', // recommended
        organizer: {
            '@type': 'Organization',
            name: 'UCLA Pourdavoud Institute',
            url: 'https://pourdavoud.ucla.edu',
        }, // recommended
    };

    // add image set
    if (image) {
        schema.image = [
            // image.width(1200).height(1200).url(), // 1x1
            image.width(1200).height(900).url(), // 4x3
            image.width(1200).height(675).url(), // 16x9
        ];
    }

    // add description
    if (event.data.preview?.length) {
        if (event.data.preview[0].children.length) {
            schema.description = event.data.preview[0].children[0].text;
        }
    }

    // add times to dates
    // if start time exists, append to start date
    if (event.data.details.startTime) {
        // leave off utc offset bc of standard vs dst? let google fill in
        schema.startDate = `${event.data.details.startDate}T${event.data.details.startTime}:00`;
    }

    // if end time exists, assume same end date as start date and append end time
    // else assume same end date as start date
    if (event.data.details.endTime) {
        schema.endDate = `${event.data.details.startDate}T${event.data.details.endTime}:00`;
    } else {
        schema.endDate = event.data.details.startDate;
    }

    // if multiday, overwrite both start/end dates with just dates, no time
    if (event.data.details.multiDay) {
        schema.startDate = event.data.details.startDate;
        schema.endDate = event.data.details.endDate;
    }

    return schema;
};
