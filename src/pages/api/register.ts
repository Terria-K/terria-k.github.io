import type { APIRoute } from "astro";
import { jwtSign } from "../../lib/auth";
import brcypt from "bcrypt";
import { addUsers } from "../../lib/mongodb";

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
    const formData = await ctx.request.formData();
    const email = (formData.get("email")?.valueOf() as string).trim();
    const password = (formData.get("password")?.valueOf() as string).trim();
    const username = (formData.get("username")?.valueOf() as string).trim();

    const salt = await brcypt.genSalt(10);
    const hashedPassword = await brcypt.hash(password, salt);

    const user = await addUsers(username, email, hashedPassword);

    const token = await jwtSign({ user }, import.meta.env.JWT_SECRET_KEY);

    return new Response(JSON.stringify(token));
}