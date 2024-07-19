import { Comment, User, db, eq } from "astro:db";
import { ulid } from "ulid";

export async function addMessages(message: string, slug: string, owner: string) {
    await db.insert(Comment).values({
        _id: ulid(),
        body: message,
        artRef: slug,
        author: owner,
        date: new Date()
    });
}

export async function removeMessages(id: string) {
    await db.delete(Comment).where(eq(Comment._id, id));
}

export async function addUsers(username: string, email: string, password: string, emailToken: string) {
    const usrObj = {
        _id: ulid(),
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
