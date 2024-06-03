import { defineMiddleware } from "astro:middleware";
import { jwtVerify, verifyToken } from "./lib/auth";

const PRIVATE_ROUTES = ["/api/comment"]

export const onRequest = defineMiddleware(async (context, next) => { 
    if (!PRIVATE_ROUTES.includes(context.url.pathname)) {
        return next();
    }
    const tokenVerified = await verifyToken(context.request);

    if (!tokenVerified) {
        return new Response("Forbidden", { status: 403 })   
    }

    try {
        await jwtVerify(tokenVerified as string, import.meta.env.JWT_SECRET_KEY);
        return next();
    }
    catch (err) {
        return new Response(err+"");
    }
})