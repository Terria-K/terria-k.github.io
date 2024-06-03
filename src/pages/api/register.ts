import type { APIRoute } from "astro";
import crypto from "crypto";
import brcypt from "bcrypt";
import { Users, addUsers } from "../../lib/mongodb";
import { sendMail } from "../../lib/mail";

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
    const formData = await ctx.request.formData();
    const email = (formData.get("email")?.valueOf() as string).trim();
    const password = (formData.get("password")?.valueOf() as string).trim();
    const confirmPassword = (formData.get("confirmation")?.valueOf() as string).trim();
    const username = (formData.get("username")?.valueOf() as string).trim();

    if (email === "" || password === "" || username === "") {
        return new Response("{ \"message\": \"Email, Username or Password are empty.\" }", { status: 401 });
    }

    const emailRegex = /[\w]+[@]{1}[\w]+\.[\w]+$/g 
    const userRegex = /[\w|\.]+$/gy

    if (!email.match(emailRegex)) {
        return new Response("{ \"message\": \"Incorrect email format.\" }", { status: 401 });
    }

    if (!username.match(userRegex)) {
        return new Response("{ \"message\": \"Username must only contains letters, numbers, underscore and periods.\" }", { status: 401 });
    }

    if (password !== confirmPassword) {
        return new Response("{ \"message\": \"Password does not matched.\" }", { status: 401 });
    }

    const [isValid, resp] = validateSecurePassword(password);
    if (!isValid) {
        return resp as Response;
    }

    const userDb = await Users();
    let user = await userDb.findOne({ email });
    if (user) {
        return new Response("{ \"message\": \"Account already existed with this email.\" }", { status: 401 });
    }
    user = await userDb.findOne({ username });
    if (user) {
        return new Response("{ \"message\": \"Account already existed with this username.\" }", { status: 401 });
    }

    const salt = await brcypt.genSalt(10);
    const hashedPassword = await brcypt.hash(password, salt);

    const emailToken: string = crypto.randomBytes(64).toString("hex");

    await addUsers(username, email, hashedPassword, emailToken);

    await sendMail(ctx.url.href, email, emailToken);

    return new Response("Success");
}

function validateSecurePassword(password: string) {
    if (password.length < 8) {
        return [
            false, 
            new Response("{ \"message\": \"Password must have atleast 8 characters.\" }", { status: 401 })
        ];
    }
    const requiredSmallOrUnderscore = /[a-z_]+/g
    const requiredBig = /[A-Z]+/g
    const requiredNumbers = /[0-9]+/g
    const requiredSpecial = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]+/g

    if (!password.match(requiredSmallOrUnderscore)) {
        return [
            false, 
            new Response("{ \"message\": \"Password must contain small letters or underscore.\" }", { status: 401 })
        ];
    }

    if (!password.match(requiredBig)) {
        return [
            false, 
            new Response("{ \"message\": \"Password must contain capital letters.\" }", { status: 401 })
        ];
    }

    if (!password.match(requiredNumbers)) {
        return [
            false, 
            new Response("{ \"message\": \"Password must contain a numbers.\" }", { status: 401 })
        ];
    }

    if (!password.match(requiredSpecial)) {
        return [
            false, 
            new Response("{ \"message\": \"Password must contain a special characters.\" }", { status: 401 })
        ];
    }

    return [true]
}