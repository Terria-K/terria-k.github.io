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

export async function addMessages(message: string, slug: string, owner: string) {
    const messageDb = await Messages();
    await messageDb.insertOne({
        text: message,
        art: slug,
        owner,
        date: new Date()
    });
}

export async function Users() {
    const db = await database();
    return db.collection("users");
}

export async function addUsers(username: string, email: string, password: string, emailToken: string) {
    const usersDb = await Users();
    const usrObj = {
        _id: new ObjectId(),
        username,
        email,
        emailToken,
        isVerified: false
    }
    await usersDb.insertOne({ ...usrObj, password });
}