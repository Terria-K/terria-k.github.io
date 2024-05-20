import type { APIRoute } from "astro";
import { createClient } from '@vercel/edge-config';

export const prerender = false;


export const GET: APIRoute = async ({ request }) => {
    const isDisabled: boolean | undefined = await createClient(import.meta.env.EDGE_CONFIG).get("disabled");

    return new Response(`
        <input ${isDisabled ? "disabled" : ""} 
            class="disabled:bg-gray-500 hover:bg-green-400 bg-green-600 duration-300 text-white px-8 py-4 text-xl rounded-xl cursor-pointer" 
            type="submit" 
            value="${isDisabled ? "Closed" : "Order"}"/>`);
}