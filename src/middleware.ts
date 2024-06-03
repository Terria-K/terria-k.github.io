import { defineMiddleware } from "astro:middleware";
import { jwtVerify, verifyToken } from "./lib/auth";

const PRIVATE_ROUTES = ["/api/comment"]
const OPTIONAL_PRIVATE = ["/api/comment"]

export const onRequest = defineMiddleware(async (context, next) => { 
    if (!PRIVATE_ROUTES.includes(context.url.pathname)) {
        return next();
    }
    const tokenVerified = await verifyToken(context.request);

    if (!tokenVerified) {
        if (OPTIONAL_PRIVATE.includes(context.url.pathname)) {
            context.locals = { user: null }
            return next();
        }
        return new Response("Unauthenticated", { status: 401 })   
    }

    try {
        const user = await jwtVerify(tokenVerified as string, import.meta.env.JWT_SECRET_KEY);
        context.locals = { user };
        return next();
    }
    catch (err) {
        return new Response(err+"");
    }
})