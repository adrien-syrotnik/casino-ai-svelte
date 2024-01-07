import { json } from '@sveltejs/kit';
import { getRandSymbol } from '$lib/symbols.server';


/** @type {import('./$types').RequestHandler} */
export async function POST() {	
	return json(getRandSymbol());
}