import type { APIRoute } from "astro";
import { addMessages } from "../../lib/mongodb";

export const prerender = false;


export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();

    const comment = (formData.get("comment")?.valueOf() as string).trim();
    const slug = (formData.get("slug")?.valueOf() as string).trim();

    if (comment === "") {
        return new Response("<p class=\"failed\">Comment is empty</p>");
    }

    await addMessages(comment, slug);
    return new Response("<p class=\"success\">Sent successfully</p>");
}