import { type CollectionEntry } from 'astro:content';
import { urlForImage } from '@lib/sanity/urlForImage';
import { getEntry } from 'astro:content';

const siteSettings = await getEntry('settings', 'siteSettingsPourdavoud');

/** Generated structured data for `events` content type to use with JSON-LD format. */
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

/** Generated organization structured data to use with JSON-LD format. */
export const organizationStructuredData = (): Record<string, any> => {
    const schema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        url: siteSettings?.data.siteDomain,
        sameAs: [
            'https://humanities.ucla.edu/academics/pourdavoud-center-study-iranian-world',
            'https://www.facebook.com/pourdavouducla',
            'https://nelc.ucla.edu/iranian/pourdavoud-center-study-iranian-world-established-ucla',
        ],
        logo: 'https://pourdavoud.ucla.edu/images/logos/pourdavoud-logo-web.svg',
        name: siteSettings?.data.seo?.title,
        alternateName: siteSettings?.data.siteName,
        description: siteSettings?.data.seo?.description,
        email: 'info@pourdavoud.ucla.edu',
        telephone: '(310) 206–6042',
        contactPoint: {
            '@type': 'ContactPoint',
            email: 'info@pourdavoud.ucla.edu',
            telephone: '(310) 206–6042',
            availableLanguage: [
                {
                    '@type': 'Language',
                    name: 'English',
                    alternateName: 'en',
                },
                {
                    '@type': 'Language',
                    name: 'Persian',
                    alternateName: 'fa',
                },
            ],
            hoursAvailable: {
                '@type': 'OpeningHoursSpecification',
                opens: '08:00:00',
                closes: '17:00:00',
            },
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: '10745 Dickson Plaza',
            extendedAddress: 'Royce Hall 212',
            addressLocality: 'Los Angeles',
            addressRegion: 'CA',
            postalCode: '90095',
            addressCountry: 'US',
        },
        slogan: 'The premier research center for the study of ancient Iran',
        keywords:
            'Iran,Iranian,Persia,Persian,Achaemenid,Sasanian,Egypt,archaeology,antiquity',
        foundingDate: '2017-01-01',
        // foundingLocation: '',
        parentOrganization: {
            '@type': 'EducationalOrganization',
            name: 'UCLA College Division of Humanities',
            url: 'https://humanities.ucla.edu',
            description:
                'UCLA Humanities is a division of the UCLA College, part of the University of California, Los Angeles.',
            parentOrganization: {
                '@type': 'EducationalOrganization',
                name: 'University of California, Los Angeles',
                alternateName: 'UCLA',
                url: 'https://www.ucla.edu',
            },
        },
    };

    return schema;
};
