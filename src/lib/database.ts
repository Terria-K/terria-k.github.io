import { Comment, User, db } from "astro:db";
import { v4 } from "uuid";

export async function addMessages(message: string, slug: string, owner: string) {
    await db.insert(Comment).values({
        body: message,
        artRef: slug,
        author: owner,
        date: new Date()
    });
}

export async function addUsers(username: string, email: string, password: string, emailToken: string) {
    const usrObj = {
        _id: v4(),
        username,
        email,
        emailToken,
        isVerified: false
    };

    await db.insert(User).values({
        ...usrObj,
        password
    })
}