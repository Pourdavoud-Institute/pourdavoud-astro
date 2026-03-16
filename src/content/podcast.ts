import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { XMLParser } from 'fast-xml-parser';

export const podcast = defineCollection({
    loader: async () => {
        const res = await fetch(
            'https://feeds.resonaterecordings.com/legacies-of-ancient-persia',
            {
                headers: {
                    'content-type': 'application/xhtml+xml',
                },
            },
        );

        const parser = new XMLParser({
            ignoreAttributes: ['isPermaLink'],
        });
        const xmlResponse = await res.text();
        const xmlDocument = parser.parse(xmlResponse);

        const items = xmlDocument.rss.channel.item;

        return items.map((item: any) => ({
            id: item.guid,
            title: item.title,
            subtitle: item['itunes:subtitle'],
            description: item.description,
            pubDate: item.pubDate,
            season: item['itunes:season'],
            type: item['itunes:episodeType'],
            duration: item['itunes:duration'],
            media: item['enclosure'],
            link: item.link,
        }));
    },

    schema: z.object({
        title: z.string(),
        subtitle: z.string().nullish(),
        description: z.string(),
        pubDate: z.coerce.date(),
        season: z.coerce.number().nullish(),
        type: z.string().nullish(),
        duration: z.coerce.number().nullish(),
        media: z.object({
            '@_url': z.url().optional(),
            '@_length': z.coerce.number().optional(),
            '@_type': z.string().optional(),
        }),
        link: z.string(),
    }),
});
