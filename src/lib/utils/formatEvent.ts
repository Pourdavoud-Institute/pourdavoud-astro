import type { CollectionEntry } from 'astro:content';
import { format } from '@formkit/tempo';

export type EventDateParts = {
    month: string;
    day: string;
};

export type EventDetailsParts = {
    date: string;
    time: string | undefined;
    location: string | undefined;
};

/** Format shortened event date parts from a Sanity event object, for use in Astro or Preact components.
 * @param eventDetails Sanity event details object
 * @returns Object of date parts
 */
export const formatEventDate = (
    details: CollectionEntry<'events'>['data']['details'],
): EventDateParts => {
    const startDate = details.startDate;

    return {
        month: format(startDate, 'MMM'),
        day: format(startDate, 'D'),
    };
};

/** Format event detail parts from a Sanity event object, for use in Astro or Preact components.
 * @param eventDetails Sanity event details object
 * @returns Object of detail parts
 */
export const formatEventDetails = (
    details: CollectionEntry<'events'>['data']['details'],
): EventDetailsParts => {
    let dateString = '';
    let timeString: string | undefined = undefined;
    let locationString: string | undefined = undefined;
    // set start date and add time to date object if exists
    let startDate = details.startDate;
    if (details.startTime) {
        startDate += ` ${details.startTime}`;
    }

    // format date string (required)
    if (details.multiDay && details.endDate) {
        dateString = `${format(startDate, 'ddd MMMM D ')}–${format(details.endDate, ' ddd MMMM D, YYYY')}`;
    } else {
        dateString = `${format(startDate, 'ddd MMMM D, YYYY')}`;
    }

    // format optional time string
    if (details.startTime && details.endTime) {
        // reconstruct end time from original start date w/o time
        timeString = `${format(startDate, 'h:mm a')}–${format(details.startDate + ' ' + details.endTime, 'h:mm a')}`;
    } else if (details.startTime) {
        timeString = `${format(startDate, 'h:mm a')}`;
    }

    // format optional location string
    if (details.location) {
        locationString = details.location;
    }

    return {
        date: dateString,
        time: timeString,
        location: locationString,
    };
};
