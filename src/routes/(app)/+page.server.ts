import type { PlayerData } from '$lib/bdd-types.js';
import { bdd } from '$lib/bdd.server';
import { DEFAULT_SYMBOLS, getAllConfigs, getConfig } from '$lib/symbols.server';
import type { SlotConfig } from '$lib/symbols.types';
import type { Actions } from '@sveltejs/kit';


export async function load({ cookies }) {

	let currentConfigToSend: SlotConfig;

	let themeChoose = cookies.get('themeChoose') as string;

	if(themeChoose){
		try {
			currentConfigToSend = getConfig(themeChoose);
		}
		catch(e){
			cookies.delete('themeChoose', { path: '/' });
			themeChoose = 'default';
			currentConfigToSend = getConfig('default');
		}
	}
	else {
		currentConfigToSend = getConfig('default');
	}

	const SYMBOLS_WITH_IMAGES = DEFAULT_SYMBOLS.map((symbol) => {
		return {
			...symbol,
			image: currentConfigToSend.images[symbol.name]
		}
	});


	//Get player data
	const player = await bdd.getPlayer(cookies.get('auth-token') as string) as PlayerData;


	//Get the leaderboard best wins
	const allBestWins = await bdd.getBestWins();

	return {
		symbols: SYMBOLS_WITH_IMAGES,
		currentConfig: currentConfigToSend,
        allConfigs: getAllConfigs(),
		player,
		allBestWins
	};
}



//When submit -> meens that user choose a theme
export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
		const themeChoose = formData.get('themeChoose') as string;

		if(themeChoose){
			cookies.set(
				'themeChoose', themeChoose,
				{
					path: '/'
				},
			);
		}
    },
}