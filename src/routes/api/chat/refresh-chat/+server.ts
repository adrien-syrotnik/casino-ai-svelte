import { getMessages } from '$lib/chat.server.js';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	//Get message from chat
	const { lastTimestamp } = await request.json();
	const messages = getMessages(lastTimestamp);

	return json({ messages });
}