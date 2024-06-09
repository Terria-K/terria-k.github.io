import { createClient } from "@vercel/edge-config";
import type { APIRoute } from "astro";
import { db, ArtCommission } from "astro:db";
import { v4 } from "uuid";

export const prerender = false;


export const POST: APIRoute = async ({ request }) => {
    const disabled: boolean | undefined = await createClient(import.meta.env.EDGE_CONFIG).get("disabled");
    if (disabled) {
      return exit("The commission request is still closed for now, please come back later.", false);
    }
    const formData = await request.formData();

    const platform = (formData.get("platform")?.valueOf() as string).trim();

    const contactName = (formData.get("contactname")?.valueOf() as string).trim();
    const title = (formData.get("title")?.valueOf() as string).trim();
    const description = (formData.get("description")?.valueOf() as string).trim();
    const reference = (formData.get("reference")?.valueOf() as string).trim();
    const payment = (formData.get("payment")?.valueOf() as string).trim();
    const size = (formData.get("size")?.valueOf() as string).trim();
    const width = formData.get("width")?.valueOf() as number;
    const height = formData.get("height")?.valueOf() as number;

    if (contactName === "") {
      if (platform === "Discord") {
        return exit("Please provide your Discord username or your Discord ID.", false);
      } 

      return exit("Please provide your contact email.", false);
    }

    if (platform === "Email") {
      const emailRegex = /[\w]+[@]{1}[\w]+\.[\w]+$/g 

      if (!contactName.match(emailRegex)) {
        return exit("Invalid email format.", false);
      }
    } else {
      const discordRegex = /[\w|\.]+$/gy

      if (!contactName.match(discordRegex)) {
        return exit("Discord username should only contains letters, numbers, underscore and periods.", false);
      }
    }

    if (title === "") {
      return exit("Please provide the title of the art.", false);
    }

    if (description === "") {
      return exit("Please provide the details of the art.", false);
    }

    if (size === "Custom") {
      if (width < 512) {
        return exit("The width must be at minimum of 512 pixels", false);
      }
      if (height < 512) {
        return exit("The height must be at minimum of 512 pixels", false);
      }
      if (width > 2500) {
        return exit("The width must be at maximum of 2500 pixels", false);
      }
      if (height > 2500) {
        return exit("The height must be at maximum of 2500 pixels", false);
      }
    }

    await db.insert(ArtCommission).values({
      _id: v4(),
      title,
      description,
      contact: contactName,
      platform,
      payment,
      references: reference,
      size: size === "Custom" ? `${+width}x${+height}` : size
    });

    const json = {
        "username": "Commission Receiver",
        "avatar_url": "https://i.imgur.com/4M34hi2.png",
        "content": "Commision Up!",
    }
    const url = "https://discord.com/api/webhooks/" + import.meta.env.SPICA;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(json)
    });

    if (res.ok) {
      return exit("Your order has been sent! Contact Teuria via Discord or Email for updates.", true);
    }

    return exit("Something went wrong with sending your order. Please try again later.", false);
}

function exit(message: string, success: boolean) {
    return new Response(`<span class="${success ? "text-green-500" : "text-red-500"}">${message}</span>`);
}