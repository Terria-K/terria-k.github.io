import type { APIRoute } from "astro";
import { addMessages, removeMessages } from "../../lib/database";

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
        name = "-1";
    } else {
        name = user.tokenUser.id;
    }

    await addMessages(comment, slug, name);
    return new Response("<p class=\"success\">Sent successfully</p>");
}

export const DELETE: APIRoute = async (ctx) => {
    const body = await ctx.request.json();

    const user = (ctx.locals as any).user;

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    } 
    if (user.tokenUser.username !== body.username) {
        return new Response("Unauthorized", { status: 401 });
    }

    await removeMessages(body.id);
    return new Response("Success");
}