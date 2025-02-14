import { getCollection } from "astro:content";

export async function getPosts() {
    return await getCollection("posts")
        .then(
            x => x.reverse()
                .sort((x, y) => new Date(y.data.date).valueOf() - new Date(x.data.date).valueOf())
                .filter(x => !x.data.draft)
        );
}