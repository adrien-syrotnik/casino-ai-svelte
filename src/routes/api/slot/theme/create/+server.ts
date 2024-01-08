import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const jaj = await request.json();
    console.log(jaj);
	return json(jaj);
}