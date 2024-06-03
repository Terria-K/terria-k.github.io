import type { APIRoute } from "astro";
import { addMessages } from "../../lib/mongodb";

export const prerender = false;


export const POST: APIRoute = async (ctx) => {
    const formData = await ctx.request.formData();

    const comment = (formData.get("comment")?.valueOf() as string).trim();
    const slug = (formData.get("slug")?.valueOf() as string).trim();

    if (comment === "") {
        return new Response("<p class=\"failed\">Comment is empty</p>");
    }

    const user = (ctx.locals as any).user;
    let name: string;
    if (!user) {
        name = "Guest";
    } else {
        name = user.tokenUser.username;
    }

    await addMessages(comment, slug, name);
    return new Response("<p class=\"success\">Sent successfully</p>");
}