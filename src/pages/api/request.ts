import type { APIRoute } from "astro";

export const prerender = false;


export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData();

    const platform = (formData.get("platform")?.valueOf() as string).trim();

    const contactName = (formData.get("contactname")?.valueOf() as string).trim();
    const title = (formData.get("title")?.valueOf() as string).trim();
    const description = (formData.get("description")?.valueOf() as string).trim();
    const reference = (formData.get("reference")?.valueOf() as string).trim();
    const size = (formData.get("size")?.valueOf() as string).trim();
    const width = formData.get("width")?.valueOf() as number
    const height = formData.get("height")?.valueOf() as number

    const json = {
        "username": "Commission Receiver",
        "avatar_url": "https://i.imgur.com/4M34hi2.png",
        "content": "Commision Up!",
        "embeds": [
            {
              "title": title,
              "description": description,
              "fields": [{
                  "name": "Requested By",
                  "value": contactName
                },
                {
                  "name": "Platform",
                  "value": platform
                },
                {
                  "name": "Art Size",
                  "value": size === "Custom" ? `${+width}x${+height}` 
                    : size
                },
                {
                  "name": "Reference Links",
                  "value": reference
                },
              ],
            }
        ]
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
        return exit("Your order has been sent!", true);
    }

    return exit("Something went wrong with sending your order. Please try again later.", false);
}

function exit(message: string, success: boolean) {
    const json = {
        message: message,
        success: success
    };
    return new Response(JSON.stringify(json));
}