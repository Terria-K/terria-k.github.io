import type { APIRoute } from "astro";
import { Users } from "../../lib/mongodb";
import { sendMail } from "../../lib/mail";

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
    const name = ctx.url.searchParams.get("receiver")?.valueOf();
    console.log(ctx.url.searchParams);

    const userDb = await Users();
    let user = await userDb.findOne({ email: name });
    if (!user) {
        user = await userDb.findOne({ username: name });
        if (!user) {
            return new Response("Account does not existed with this email or username.", { status: 401 });
        }
    }

    sendMail(ctx.url.href, user.email, user.emailToken);

    return new Response("The verification token has been resend to your email. Please check your inbox or spam.");
}