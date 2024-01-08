import { testDalle, testDalleLocal, testHugginModel } from '$lib/openAPI.server';
import { DEFAULT_SYMBOLS, currentConfig, getAllConfigs } from '$lib/symbols.server';

export function load() {
	// testDalle();
	// testHugginModel();
	testDalleLocal();
	return {
		symbols: DEFAULT_SYMBOLS,
        currentConfig,
        allConfigs: getAllConfigs()
	};
}