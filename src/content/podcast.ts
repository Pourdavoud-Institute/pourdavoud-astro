import { defineCollection, z } from 'astro:content';
import { XMLParser } from 'fast-xml-parser';

export const podcast = defineCollection({
    loader: async () => {
        const res = await fetch(
            'https://feeds.resonaterecordings.com/legacies-of-ancient-persia',
        );

        const parser = new XMLParser();
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
            episode: item['itunes:episode'],
            duration: item['itunes:duration'],
            link: item.link,
        }));
    },

    schema: z.object({
        title: z.string(),
        subtitle: z.string().nullish(),
        description: z.string(),
        pubDate: z.coerce.date(),
        season: z.number().nullish(),
        episode: z.union([z.string(), z.number()]).nullable(),
        duration: z.number(),
        link: z.string(),
    }),
});
