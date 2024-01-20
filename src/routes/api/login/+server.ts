import { json } from '@sveltejs/kit';
import { bdd, type PlayerData } from '$lib/bdd.server';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	const { username, password } = await request.json();

	//Check if username and password are valid or empty
	if(!username || !password || username.length < 3 || password.length < 3){
		return json({ error: 'Username or password is invalid' }, { status: 400 });
	}

	//Create the id from username and password, by creating a hash and using a salt from .env
	const id = bdd.createId(username, password);

	//Check if user exist
	const user = await bdd.getPlayer(id);

	if(user){
		//Set the cookie
		cookies.set(
			'auth-token', id,
			{
				path: '/'
			},
		);

		return json({ id });
	}

	//Create the user
	const newUser = {
		id,
		name: username,
		balance: 1000,
		created_at: Date.now().toString()
	} as PlayerData;

	await bdd.addPlayer(newUser);

	//Set the cookie
	cookies.set(
		'auth-token', id,
		{
			path: '/'
		},
	);

	return json({ id });
}