import type { APIRoute } from "astro";
import { createClient } from '@vercel/edge-config';

export const prerender = false;


export const GET: APIRoute = async ({ request }) => {
    const isDisabled: boolean | undefined = await createClient(import.meta.env.EDGE_CONFIG).get("disabled");
    const result = {
        r: isDisabled
    };
    return new Response(JSON.stringify(result));
}