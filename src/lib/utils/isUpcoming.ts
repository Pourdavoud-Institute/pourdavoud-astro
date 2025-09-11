import { isAfter, sameDay, tzDate } from '@formkit/tempo';

/**
 * Checks whether a date string is today or after.
 * @param date ISO date string
 */
export const isUpcoming = (date: string): boolean => {
    const now = new Date();
    return (
        sameDay(tzDate(date, 'America/Los_Angeles'), now) || isAfter(date, now)
    );
};
