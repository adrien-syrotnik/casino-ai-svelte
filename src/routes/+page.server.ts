import { testDalle } from '$lib/openAPI.server';
import { DEFAULT_SYMBOLS, currentConfig, getAllConfigs } from '$lib/symbols.server';

export function load() {
	// testDalle();
	return {
		symbols: DEFAULT_SYMBOLS,
        currentConfig,
        allConfigs: getAllConfigs()
	};
}