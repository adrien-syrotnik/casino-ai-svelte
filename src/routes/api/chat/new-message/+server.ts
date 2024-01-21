import { getMessages, addMessage } from '$lib/chat.server.js';
import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	//Create a new message
	const { message } = await request.json();
	addMessage(message);

	//Get message from chat
	const messages = getMessages(message.timestamp);

	return json({ messages });

}