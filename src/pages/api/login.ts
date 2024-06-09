import type { APIRoute } from "astro";
import bycrpt from "bcrypt";
import { jwtSign } from "../../lib/auth";
import { User, db, eq, or } from "astro:db";

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
    const formData = await ctx.request.formData();
    const email = (formData.get("email")?.valueOf() as string).trim();
    const password = (formData.get("password")?.valueOf() as string).trim();

    if (email === "" || password === "") {
        return new Response("Email or Password are empty.", { status: 401 });
    }

    let findIfExists = await db.select().from(User).where(
        or(
            eq(User.email, email), 
            eq(User.username, email))
        );

    let user = findIfExists.at(0);

    if (user) {
        const isMatch = await bycrpt.compare(password, user.password);
        if (!isMatch) {
            return new Response("Invalid Password", { status: 401 });
        }

        if (!user.isVerified) {
            return new Response(`
            Email has not been verified yet! <a 
                style="color: cyan;" 
                href="/api/resend?receiver=${email}" target="_blank">Click here to resend.</a>
        `, { status: 401 })
        }

        const tokenUser = {
            id: user?._id,
            username: user.username,
            email: user.email
        }

        const token = await jwtSign({ tokenUser }, import.meta.env.JWT_SECRET_KEY);
        return new Response(JSON.stringify(token));
    }

    return new Response("Email, Username or Password are invalid.", { status: 401 });
}

