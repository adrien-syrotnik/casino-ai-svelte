import { json } from '@sveltejs/kit';
import { checkLines25 } from '$lib/symbols.server';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { reel1, reel2, reel3, reel4, reel5 } = await request.json();
	return json(checkLines25(reel1, reel2, reel3, reel4, reel5));
}