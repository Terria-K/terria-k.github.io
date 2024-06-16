import type { APIRoute } from "astro";
import { jwtVerify, verifyToken } from "../../lib/auth";

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
  const tokenVerified = await verifyToken(ctx.request);

  if (!tokenVerified) {
    return new Response("false");
  }

  try {
    await jwtVerify(tokenVerified as string, import.meta.env.JWT_SECRET_KEY);
    return new Response("true");
  } catch (err) {
    return new Response("false");
  }
};
