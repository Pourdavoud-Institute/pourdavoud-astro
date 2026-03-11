import { createClient } from '@sanity/client';

export const sanityClient = createClient({
    projectId: '3z4imst3',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2026-01-01',
});
