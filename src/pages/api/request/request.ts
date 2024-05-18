import type { APIRoute } from "astro";

export const prerender = false;


export const post: APIRoute = async ({ request }) => {
    console.log(import.meta.env.SPICA);
    const json = await request.json();
    const url = "https://discord.com/api/webhooks/" + import.meta.env.SPICA;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(json)
    });

    return res;
}