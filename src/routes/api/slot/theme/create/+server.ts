import { GenerateAllImagesLocal, GenerateAllImagesOpenAI, resetImageGeneration } from '$lib/openAPI.server.js';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const body = await request.json();
	if (!body.themePrompt) return json({ done: false, error: "themePrompt is required" });

	const useOpenAPI = body.useOpenAPI;
	const openAPIKey = body.openAPIKey;
	const precision = body.precision ?? 20;
	const themePrompt = body.themePrompt;
	const useDalle3 = body.useDalle3 ?? true;
	const useBetterPrompt = body.useBetterPrompt ?? false;


	try {
		if (useOpenAPI) {
			if (!body.openAPIKey) return json({ done: false, error: "openAPIKey is required" });
			GenerateAllImagesOpenAI(themePrompt, openAPIKey, useDalle3, useBetterPrompt, precision).catch(e => {
				console.error(e);
				resetImageGeneration();
			});
			return json({ done: true });
		}


		if (precision) GenerateAllImagesLocal(themePrompt, useBetterPrompt, openAPIKey, precision);
		else GenerateAllImagesLocal(body.themePrompt);
		return json({ done: true });
	}
	catch (e) {
		resetImageGeneration();
		return json({ done: false, error: e });
	}
}