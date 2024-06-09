import { db, User } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(User).values([
		{ 
			_id: "-1", 
			username: "Guest", 
			email: "guest@email.com", 
			password: "securedpasswordever",
			isVerified: true,
		}
	])
}
