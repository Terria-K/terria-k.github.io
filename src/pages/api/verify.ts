import type { APIRoute } from "astro";
import { User, db, eq } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
    const token = ctx.url.searchParams.get("token");

    if (!token) {
        return new Response("Can't find a token!", { status: 401 });
    }

    let findIfExists = await db.select().from(User).where(eq(User.emailToken, token));
    let user = findIfExists.at(0);

    if (!user) {
        return new Response("User not found!", { status: 401 });
    }

    if (user.isVerified) {
        return new Response("User has already been verified!", { status: 401 });
    }

    await db.update(User).set({ emailToken: null, isVerified: true });

    return ctx.redirect("/login");
}