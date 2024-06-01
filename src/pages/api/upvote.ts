import type { APIRoute } from "astro";
import { upvoteComment } from "../../lib/mongodb";
import type { ObjectId } from "mongodb";

export const prerender = false;


export const POST: APIRoute = async ({ request }) => {
    const url = new URL(request.url)
    const params = new URLSearchParams(url.search)

    // set up a response object
    const data = {
        message: params.get('message'),
    };


    await upvoteComment(data.message as ObjectId);
}