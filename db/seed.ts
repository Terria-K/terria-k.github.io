import { db, Comment, User } from 'astro:db';
import { v4 } from 'uuid';

// https://astro.build/db/seed
export default async function seed() {
	const terriaID = v4();
	await db.insert(User).values([
		{ 
			_id: "-1", 
			username: "Guest", 
			email: "guest@email.com", 
			password: "securedpasswordever",
			isVerified: true,
		},
		{ 
			_id: terriaID, 
			username: "Terria", 
			email: "terria@email.com", 
			password: "securedpasswordever",
			isVerified: true,
		}
	])

	await db.insert(Comment).values([
		{  author: terriaID, artRef: "Relentless Night", date: new Date(), body: "Coolio!" },
		{  author: "-1", artRef: "Relentless Night", date: new Date(), body: "Wooh!" },
	])
}
