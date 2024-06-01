import { Db, MongoClient, ObjectId } from "mongodb";

const url = import.meta.env.MONGO_URL;

if (!url) {
    throw new Error("Invalid env variable: 'MONGO_URL'");
}

let cachedMongo: Db;

async function connectToDB() {
    const mongo = await new MongoClient(url, {}).connect();

    return mongo.db("teuriaDB");
}

export async function database() {
    if (import.meta.env.MODE === "development") {
        /**@ts-ignore */
        if (!global._mongoConnection) {
            /**@ts-ignore */
            global._mongoConnection = await connectToDB();
            /**@ts-ignore */
            cachedMongo = global._mongoConnection;
        }

        return cachedMongo;
    }

    const mongo = await connectToDB();
    return mongo;
}

export async function Messages() {
    const db = await database();
    return db.collection("messages");
}

export async function addMessages(message: string, slug: string) {
    const messageDb = await Messages();
    await messageDb.insertOne({
        text: message,
        art: slug,
        date: new Date(),
        score: 0
    });
}

export async function upvoteComment(id: ObjectId) {
    const messageDb = await Messages();
    await messageDb.updateOne({_id: id}, { $inc: { score: 1 }});
}

export async function downvoteComment(id: ObjectId) {
    const messageDb = await Messages();
    await messageDb.updateOne({_id: id}, { $inc: { score: -1 }});
}