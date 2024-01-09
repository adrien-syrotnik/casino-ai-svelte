import { GenerateAllImagesLocal, GenerateAllImagesOpenAI, resetImageGeneration } from '$lib/openAPI.server.js';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const body = await request.json();
	if (!body.themePrompt) return json({ done: false, error: "themePrompt is required" });

	try {
		if (body.useOpenAPI) {
			if (!body.openAPIKey) return json({ done: false, error: "openAPIKey is required" });
			const useDalle3 = true;
			GenerateAllImagesOpenAI(body.themePrompt, body.openAPIKey, useDalle3, body.precision).catch(e => {
				console.error(e);
				resetImageGeneration();
			});
			return json({ done: true });
		}


		if (body.precision) GenerateAllImagesLocal(body.themePrompt, body.precision);
		else GenerateAllImagesLocal(body.themePrompt);
		return json({ done: true });
	}
	catch (e) {
		resetImageGeneration();
		return json({ done: false, error: e });
	}
}