import type { APIRoute } from "astro";
import { sendMail } from "../../lib/mail";
import { User, db, eq, or } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
    const name = ctx.url.searchParams.get("receiver")?.valueOf();
    if (!name) {
        return new Response("Something went wrong.", { status: 401 });
    }

    let findIfExists = await db.select().from(User).where(
        or(
            eq(User.email, name), 
            eq(User.username, name))
        );

    let user = findIfExists.at(0);

    if (!user) {
        return new Response("Account does not existed with this email or username.", { status: 401 });
    }

    if (user.emailToken) {
        sendMail(ctx.url.href, user.email, user.emailToken);
    } else {
        return new Response("This user has already been verified.");
    }


    return new Response("The verification token has been resend to your email. Please check your inbox or spam.");
}