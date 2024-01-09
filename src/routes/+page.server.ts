import { DEFAULT_SYMBOLS, currentConfig, getAllConfigs, getConfig, setConfig } from '$lib/symbols.server';
import type { Actions } from './$types';

export function load({ cookies }) {

	let currentConfigToSend = currentConfig;

	let themeChoose = cookies.get('themeChoose') as string;

	if(themeChoose){
		try {
			currentConfigToSend = getConfig(themeChoose);
		}
		catch(e){
			cookies.delete('themeChoose', { path: '/' });
			themeChoose = 'default';
		}
		setConfig(themeChoose);
	}
		

	return {
		symbols: DEFAULT_SYMBOLS,
		currentConfig: currentConfigToSend,
        allConfigs: getAllConfigs()
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