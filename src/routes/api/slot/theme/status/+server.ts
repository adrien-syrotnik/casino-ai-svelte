import { currentImageGenerationStep, currentImageGenerationTheme, currentStateImageGeneration } from "$lib/openAPI.server.js";
import { AllImageToGenerate } from "$lib/states-image-generation";
import { json } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ request }) {
	// const body = await request.json();
	// if(!body.theme) return json({ done : false, error : "theme is required" });

    if(currentImageGenerationTheme === "") return json({ status : null });

    const status = {
        currentStateImageGeneration,
        currentImageGenerationTheme,
        step : currentImageGenerationStep,
        totalSteps : AllImageToGenerate.length
    }

	return json({ status });
}