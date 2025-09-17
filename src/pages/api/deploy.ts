import type { APIRoute } from 'astro';
import { WEBHOOK_SECRET, getSecret } from 'astro:env/server';

export const prerender = false;

export const GET: APIRoute = () => {
    console.log(WEBHOOK_SECRET);
    return new Response('Endpoint for deploy webhook', {
        status: 200,
    });
};

export const POST: APIRoute = async ({ request }) => {
    console.log(request.headers);
    if (
        request.headers.get('Content-Type') === 'application/json' &&
        request.headers.get('webhook-secret') === WEBHOOK_SECRET
    ) {
        // replicate sanity headers:
        // sanity-webhook-id
        // sanity-transaction-time
        // sanity-project-id
        const body = await request.json();
        console.log('secret check passed');
        console.log(body);

        return new Response('Accepted', {
            status: 202,
            statusText: 'Webhook received',
        });
    }

    return new Response(
        JSON.stringify({
            error: 'Webhook incorrectly configured.',
        }),
        { status: 400, statusText: 'Error' },
    );
};
