import { defineMiddleware } from "astro:middleware";
import { jwtVerify, verifyToken } from "./lib/auth";

const PRIVATE_ROUTES = ["/api/comment", "/partials/commentVerify"]
const OPTIONAL_PRIVATE = ["/api/comment", "/partials/commentVerify"]

export const onRequest = defineMiddleware(async (context, next) => { 
    if (!PRIVATE_ROUTES.includes(context.url.pathname)) {
        return next();
    }
    const tokenVerified = await verifyToken(context.request);

    if (!tokenVerified) {
        if (OPTIONAL_PRIVATE.includes(context.url.pathname)) {
            context.locals = { user: null, expired: false }
            return next();
        }
        return new Response("Unauthenticated", { status: 401 })   
    }

    try {
        const user = await jwtVerify(tokenVerified as string, import.meta.env.JWT_SECRET_KEY);
        context.locals = { user, expired: false };
        return next();
    }
    catch (err) {
        if (OPTIONAL_PRIVATE.includes(context.url.pathname)) {
            context.locals = { user: null, expired: true };
            return next();
        }
        return new Response(err + "");
    }
})