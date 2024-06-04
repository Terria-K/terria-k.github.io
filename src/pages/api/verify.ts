import type { APIRoute } from "astro";
import { Users } from "../../lib/mongodb";

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
    const token = ctx.url.searchParams.get("token");

    if (!token) {
        return new Response("Can't find a token!", { status: 401 });
    }

    const userDb = await Users();

    const user = await userDb.findOne({ emailToken: token });
    if (!user) {
        return new Response("User not found!", { status: 401 });
    }

    if (user.isVerified) {
        return new Response("User has already been verified!", { status: 401 });
    }

    await userDb.updateOne({ emailToken: token }, { 
        "$set": { isVerified: true },
        "$unset": { emailToken: "" }
    });

    return ctx.redirect("/login");
}