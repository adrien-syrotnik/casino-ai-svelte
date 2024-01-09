import { GenerateAllImages } from '$lib/openAPI.server.js';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const body = await request.json();
	if(!body.themePrompt) return json({ done : false, error : "themePrompt is required" });

	if(body.precision) GenerateAllImages(body.themePrompt, body.precision);
	else GenerateAllImages(body.themePrompt);
	return json({ done : true });
}