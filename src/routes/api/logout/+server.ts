import { json } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies }) {
	//Remove the cookie
	cookies.delete('auth-token', {
		path: '/'
	});

	return json({ success: true });
}