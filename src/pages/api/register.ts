import type { APIRoute } from "astro";
import crypto from "crypto";
import brcypt from "bcrypt";
import { addUsers } from "../../lib/mongodb";
import { sendMail } from "../../lib/mail";

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
    const formData = await ctx.request.formData();
    const email = (formData.get("email")?.valueOf() as string).trim();
    const password = (formData.get("password")?.valueOf() as string).trim();
    const username = (formData.get("username")?.valueOf() as string).trim();

    const salt = await brcypt.genSalt(10);
    const hashedPassword = await brcypt.hash(password, salt);

    const emailToken: string = crypto.randomBytes(64).toString("hex");

    const user = await addUsers(username, email, hashedPassword, emailToken);

    await sendMail(ctx.url.href, email, emailToken);

    return new Response("Success");
}