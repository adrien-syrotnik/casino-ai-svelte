import { json } from '@sveltejs/kit';
import { DEFAULT_SYMBOLS, checkLines25, getRandMatrixSymbol } from '$lib/symbols.server';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { rows } = await request.json();
	//Spin
	const allMatrixInfos = getRandMatrixSymbol(rows ?? 5);
	const { stringMatrix, bonus, wildPosition } = allMatrixInfos;
	//Replace string by slotSymbols finds in DEFAULT_SYMBOLS
	const symbolMatrix = stringMatrix.map((row) => row.map((symbol) => DEFAULT_SYMBOLS.find((slotSymbol) => slotSymbol.name === symbol)));


	const reel1 = symbolMatrix[0].slice(1, 4).map((s) => s!.name),
		  reel2 = symbolMatrix[1].slice(1, 4).map((s) => s!.name),
		  reel3 = symbolMatrix[2].slice(1, 4).map((s) => s!.name),
		  reel4 = symbolMatrix[3].slice(1, 4).map((s) => s!.name),
		  reel5 = symbolMatrix[4].slice(1, 4).map((s) => s!.name);

	const result = checkLines25(reel1, reel2, reel3, reel4, reel5);

	return json({ matrix : symbolMatrix, bonus, wildPosition, result });
}