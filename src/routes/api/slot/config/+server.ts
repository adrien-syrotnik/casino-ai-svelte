import { json } from '@sveltejs/kit';
import { getAllConfigs, getConfig } from '$lib/symbols.server';


/** @type {import('./$types').RequestHandler} */
export async function GET({ request }) {
	const { name } = await request.json();
    //If no name return all configs
    if (!name) {
        return json(getAllConfigs());
    }
    //If name return config
	return json(getConfig(name));
}