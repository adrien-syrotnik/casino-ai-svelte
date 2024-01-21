import { bdd } from '$lib/bdd.server';
import { redirect, type Cookies } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
    const currentPath = event.url.pathname;
    const cookies = event.cookies;

    // Auth check
    const isTokenValid = await validateTokenFunction(cookies);

    // Restrict all routes exept /login
    if (!currentPath.includes("/login")) {
        if (!isTokenValid) {
            //put the current path in the cookie httpOnly
            cookies.set(
                'redirect-path', currentPath,
                {
                    path: '/',
                    httpOnly: true
                },
            );
            throw redirect(303, "/login");
        }
    }


    //In reverse, if the user is logged in, redirect to home if he tries to access /login
    if (currentPath.includes("/login")) {
        if (isTokenValid) {
            throw redirect(303, "/");
        }
    }

    // //If ok remove the cookie
    // if (cookies.get('redirect-path')) {
    //     cookies.delete('redirect-path', {
    //         path: '/'
    //     });
    // }


    const response = await resolve(event);

    return response;
}

const validateTokenFunction = async (cookies: Cookies) => {
    // This will look for the user's cookies and see if the auth token exists
    const currentToken = cookies.get("auth-token") as string;

    //Try to get id from the database
    try {
        const user = await bdd.getPlayer(currentToken);
        if (user) {
            return true;
        }
    }
    catch (e) {
        return false;
    }
    return false;
}