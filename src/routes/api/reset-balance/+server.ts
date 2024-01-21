import { bdd } from '$lib/bdd.server.js';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies }) {
	//Reset balance of the player
	
	//Find the player first
	const player = await bdd.getPlayer(cookies.get('auth-token') as string);
	if(!player){
		return json({ error: 'Bad token' }, { status: 400 });
	}

	//Reset balance
	player.balance = 1000;

	//Update player
	await bdd.updatePlayer(player);

	return json({ success: true, newBalance: player.balance });
}