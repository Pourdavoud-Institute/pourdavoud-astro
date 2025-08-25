import type { CollectionEntry } from 'astro:content';
import { workspaces } from '@lib/sanity/workspaces';

/** Helper to match a person's role or faculty title with the workspace id
 * @param person Person collection entry
 * @returns Workspace role if exists, else faculty title, else institution, else undefined
 */
export const getPersonRole = (
    person: CollectionEntry<'people'>,
): string | undefined => {
    let role: string | undefined = undefined;
    if (
        person.data.affiliationType == 'internal' &&
        person.data.internalRoles.length > 0
    ) {
        role = person.data.internalRoles.find(
            (role) => role.organization._id == workspaces.pourdavoud.id,
        )?.title;
    } else if (person.data.facultyTitle) {
        role = person.data.facultyTitle;
    } else if (person.data.institution) {
        role = person.data.institution;
    }
    return role;
};
