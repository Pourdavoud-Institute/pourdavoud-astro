import type { Loader } from 'astro/loaders';
import { sanityClient } from '@lib/sanity/client';
import type {
    SanityDocument,
    QueryWithoutParams,
    QueryParams,
} from '@sanity/client';

interface LoaderOptions {
    name: string; // identifying name of the query
    query: string; // GROQ query
    params?: Record<string, any>; // optional params
}

export function customSanityLoader({
    name,
    query,
    params,
}: LoaderOptions): Loader {
    return {
        name: 'sanity-loader',
        load: async ({ store, parseData, logger }) => {
            logger.info(`Loading Sanity data from "${name}" query`);
            const res = await sanityClient.fetch<SanityDocument[]>(query, {
                ...params,
            });

            store.clear();
            for (const item of res) {
                const id = item._id;
                const data = await parseData({
                    id,
                    data: item,
                });
                store.set({ id, data });
            }

            logger.info(`Loaded ${res.length} "${name}" items from Sanity`);
        },
    } satisfies Loader;
}
