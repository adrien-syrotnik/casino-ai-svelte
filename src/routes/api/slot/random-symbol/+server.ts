import { json } from '@sveltejs/kit';
import { DEFAULT_SYMBOLS, getRandMatrixSymbol } from '$lib/symbols.server';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request}) {
	const { rows } = await request.json();
	const allMatrixInfos = getRandMatrixSymbol(rows ?? 5);
	const { stringMatrix, bonus, wildPosition } = allMatrixInfos;
	//Replace string by slotSymbols finds in DEFAULT_SYMBOLS
	const symbolMatrix = stringMatrix.map((row) => row.map((symbol) => DEFAULT_SYMBOLS.find((slotSymbol) => slotSymbol.name === symbol)));

	return json({ matrix : symbolMatrix, bonus, wildPosition });
}