import { testDalle } from "$lib/openAPI.server";


/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    testDalle();
	return {
		// post: await db.getPost(params.slug)
	};
}