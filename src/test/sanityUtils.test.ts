import { assert, expect, describe, test } from 'vitest';
import type { Link } from '@content/schemaFragments/sanityComponents';
import type { RichText } from '@content/schemaFragments/pageModules';
import { sanityLink } from '@lib/utils/sanityLink';
import { formatEventDate, formatEventDetails } from '@lib/utils/formatEvent';
import type { CollectionEntry } from 'astro:content';
import { sortUpcoming } from '@lib/utils/sortEvents';
import { getRichTextHeadings } from '@lib/utils/getRichTextHeadings';
import { getPersonRole } from '@lib/utils/people';
import { workspaces } from '@lib/sanity/workspaces';

test('builds valid href/parts from a Sanity link object', () => {
    const linkObjectReference: Link = {
        type: 'reference',
        label: 'Label override',
        reference: {
            _id: 'id',
            slug: '/test-page',
            title: 'Test Page',
        },
    };
    const linkObjectExternal: Link = {
        type: 'external',
        label: 'External link',
        target: true,
        href: 'https://test.com',
    };
    const linkObjectInternal: Link = {
        type: 'internal',
        label: 'Internal link',
        target: false,
        href: '/home',
    };

    expect(sanityLink(linkObjectReference)).toEqual({
        label: 'Label override',
        url: '/test-page',
        target: '_self',
    });
    expect(sanityLink(linkObjectExternal)).toEqual({
        label: 'External link',
        url: 'https://test.com',
        target: '_blank',
    });
    expect(sanityLink(linkObjectInternal)).toEqual({
        label: 'Internal link',
        url: '/',
        target: '_self',
    });
});

describe('Sanity events', () => {
    test('formats a shortened month and day for previews', () => {
        const eventDetails: CollectionEntry<'events'>['data']['details'] = {
            startDate: '2026-01-01',
            multiDay: false,
        };
        expect(formatEventDate(eventDetails)).toEqual({
            month: 'Jan',
            day: '1',
        });
    });

    test('formats details for event with start time', () => {
        const eventDetails: CollectionEntry<'events'>['data']['details'] = {
            startDate: '2026-01-01',
            multiDay: false,
            startTime: '16:00',
            location: 'UCLA',
        };
        expect(formatEventDetails(eventDetails)).toEqual({
            date: 'Thu January 1, 2026',
            time: '4:00 pm',
            location: 'UCLA',
        });
    });

    test('formats details for event with multiday', () => {
        const eventDetails: CollectionEntry<'events'>['data']['details'] = {
            startDate: '2026-01-01',
            endDate: '2026-01-03',
            multiDay: true,
            location: 'UCLA',
        };
        expect(formatEventDetails(eventDetails)).toEqual({
            date: 'Thu January 1 – Sat January 3, 2026',
            time: undefined,
            location: 'UCLA',
        });
    });

    test('sorts events in upcoming order by datetime', () => {
        // has 3 entries that are same day with different start times, incl. one with no start time
        const events: CollectionEntry<'events'>[] = [
            {
                id: 'event-2',
                collection: 'events',
                data: {
                    _id: 'event-2',
                    _type: 'event',
                    title: 'Event 2',
                    slug: '/event-2',
                    details: {
                        startDate: '2029-01-01',
                        multiDay: false,
                    },
                    preview: [],
                    speakersRef: [],
                    place: [],
                    videos: [],
                    categories: [],
                    tags: [],
                },
            },
            {
                id: 'event-1',
                collection: 'events',
                data: {
                    _id: 'event-1',
                    _type: 'event',
                    title: 'Event 1',
                    slug: '/event-1',
                    details: {
                        startDate: '2028-12-01',
                        multiDay: false,
                    },
                    preview: [],
                    speakersRef: [],
                    place: [],
                    videos: [],
                    categories: [],
                    tags: [],
                },
            },
            {
                id: 'event-3',
                collection: 'events',
                data: {
                    _id: 'event-3',
                    _type: 'event',
                    title: 'Event 3',
                    slug: '/event-3',
                    details: {
                        startDate: '2029-01-01',
                        startTime: '16:00',
                        multiDay: false,
                    },
                    preview: [],
                    speakersRef: [],
                    place: [],
                    videos: [],
                    categories: [],
                    tags: [],
                },
            },
            {
                id: 'event-4',
                collection: 'events',
                data: {
                    _id: 'event-4',
                    _type: 'event',
                    title: 'Event 4',
                    slug: '/event-4',
                    details: {
                        startDate: '2029-01-01',
                        startTime: '18:00',
                        multiDay: false,
                    },
                    preview: [],
                    speakersRef: [],
                    place: [],
                    videos: [],
                    categories: [],
                    tags: [],
                },
            },
        ];
        const ordered = sortUpcoming(events).map((event) => event.id);
        assert.sameOrderedMembers(ordered, [
            'event-1',
            'event-2',
            'event-3',
            'event-4',
        ]);
    });
});

describe('Sanity collections', () => {
    const org1 = {
        _id: workspaces.pourdavoud.id,
        title: workspaces.pourdavoud.title,
    };
    const org2 = {
        _id: workspaces.yarshater.id,
        title: workspaces.yarshater.title,
    };

    test('builds list of `h2` headings from a `richText` page module', () => {
        const module: RichText = {
            _type: 'richText',
            options: {
                sectionMargin: false,
            },
            blocks: [
                {
                    style: 'h2',
                    children: [{ text: 'First heading' }],
                },
                {
                    style: 'other',
                    children: [{ text: 'some text' }],
                },
                {
                    style: 'other',
                    children: [{ text: 'some text' }],
                },
                {
                    style: 'h2',
                    children: [{ text: 'Second heading' }],
                },
            ],
        };
        expect(getRichTextHeadings(module)).toHaveLength(2);
    });

    test('sets correct role for person by type and workspace', () => {
        const staffPerson1: CollectionEntry<'people'> = {
            id: 'internal-role',
            collection: 'people',
            data: {
                _id: 'internal-role',
                _type: 'person',
                slug: '/people/ebrahim-pourdavoud',
                name: { firstName: 'Ebrahim', lastName: 'Pourdavoud' },
                title: 'Ebrahim Pourdavoud',
                affiliationType: 'internal',
                internalRoles: [
                    { _type: 'role', title: 'Org 1 Role', organization: org1 },
                    { _type: 'role', title: 'Org 2 Role', organization: org2 },
                ],
                biography: [],
                categories: [],
            },
        };
        const staffPerson2: CollectionEntry<'people'> = {
            id: 'undefined-role',
            collection: 'people',
            data: {
                _id: 'undefined-role',
                _type: 'person',
                slug: '/people/ebrahim-pourdavoud',
                name: { firstName: 'Ebrahim', lastName: 'Pourdavoud' },
                title: 'Ebrahim Pourdavoud',
                affiliationType: 'internal',
                internalRoles: [],
                biography: [],
                categories: [],
            },
        };
        const facultyPerson1: CollectionEntry<'people'> = {
            id: 'faculty-title',
            collection: 'people',
            data: {
                _id: 'faculty-title',
                _type: 'person',
                slug: '/people/ebrahim-pourdavoud',
                name: { firstName: 'Ebrahim', lastName: 'Pourdavoud' },
                title: 'Ebrahim Pourdavoud',
                internalRoles: [],
                affiliationType: 'ucla',
                facultyTitle: 'Professor of Iranian',
                institution: 'UCLA',
                biography: [],
                categories: [],
            },
        };
        const facultyPerson2: CollectionEntry<'people'> = {
            id: 'faculty-institution',
            collection: 'people',
            data: {
                _id: 'faculty-institution',
                _type: 'person',
                slug: '/people/ebrahim-pourdavoud',
                name: {
                    firstName: 'Ebrahim',
                    lastName: 'Pourdavoud',
                },
                title: 'Ebrahim Pourdavoud',
                internalRoles: [],
                affiliationType: 'ucla',
                institution: 'UCLA',
                biography: [],
                categories: [],
            },
        };
        const gradStudentPerson: CollectionEntry<'people'> = {
            id: 'grad-student',
            collection: 'people',
            data: {
                _id: 'grad-student',
                _type: 'person',
                slug: '/people/ebrahim-pourdavoud',
                name: {
                    firstName: 'Ebrahim',
                    lastName: 'Pourdavoud',
                },
                title: 'Ebrahim Pourdavoud',
                internalRoles: [],
                affiliationType: 'ucla',
                department: 'nelc',
                biography: [],
                categories: [
                    {
                        _id: '226fe6c7-8fcf-4f83-a69c-6bd83c4a00fd',
                        _type: 'category',
                        title: 'Grad Students',
                        slug: '/category',
                    },
                ],
            },
        };
        expect(getPersonRole(staffPerson1)).toBe('Org 1 Role');
        expect(getPersonRole(staffPerson2)).toBe(undefined);
        expect(getPersonRole(facultyPerson1)).toBe('Professor of Iranian');
        expect(getPersonRole(facultyPerson2)).toBe('UCLA');
        expect(getPersonRole(gradStudentPerson)).toBe(
            'Graduate Student, Near Eastern Languages and Cultures',
        );
    });
});
