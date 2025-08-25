/** Converts duration in seconds to formatted time output, ie 32:02
 * @param d Duration in seconds.
 * @returns Formatted time output in hh:mm:ss format.
 */
export const formatSeconds = (d: number): string => {
    let h, m, s: number | string;
    h = Math.floor(d / 3600);
    m = Math.floor((d % 3600) / 60);
    s = `${Math.floor(d % 60)}`.padStart(2, '0');

    if (h > 0) {
        // h = `${h}`.padStart(2, '0');
        m = `${m}`.padStart(2, '0');

        return `${h}:${m}:${s}`;
    }

    return `${m}:${s}`;
};
