import type { APIRoute } from "astro";

export const prerender = false;


export const GET: APIRoute = async ({ request }) => {
    const isDisabled = import.meta.env.DISABLED;

    return new Response(isDisabled);
}