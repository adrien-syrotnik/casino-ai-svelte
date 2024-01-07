import { DEFAULT_SYMBOLS, currentConfig, getAllConfigs } from '$lib/symbols.server';

export function load() {
	return {
		symbols: DEFAULT_SYMBOLS,
        currentConfig,
        allConfigs: getAllConfigs()
	};
}