import type { APIRoute } from "astro";
import { addMessages, removeMessages } from "../../lib/database";
import { Comment,User,db,desc,eq,like,sql } from "astro:db";
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

export const GET: APIRoute = async (ctx) => {
    const slug = ctx.url.searchParams.get("slug");
    const page = ctx.url.searchParams.get("page");
    let pageNumber = 0;
    if (page) {
        pageNumber = +page;
    }

    const messages = await db.select({
        count: sql<number>`count(*) over()`,
        comment: Comment,
        username: User.username
    }).from(Comment)
        .where(like(Comment.artRef, `%${slug}%`))
        .innerJoin(User, eq(Comment.author, User._id))
        .orderBy(desc(Comment.date))
        .limit(5)
        .offset(pageNumber * 5); 


    const isExpired = (ctx.locals as any).expired;
    let name: string = "";
    if (!isExpired) {
        const user = (ctx.locals as any).user;
        if (!user) {
            name = "Guest";
        } else {
            name = user.tokenUser.username;
        }
    }

    let data = {
        sessionName: name,
        messages
    };

    return new Response(JSON.stringify(data));
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