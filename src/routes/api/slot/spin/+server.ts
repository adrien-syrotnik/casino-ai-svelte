import { json } from '@sveltejs/kit';
import { DEFAULT_SYMBOLS, checkLines25, getRandMatrixSymbol } from '$lib/symbols.server';
import { bdd } from '$lib/bdd.server';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {

	//Check if user is logged
	const currentToken = cookies.get("auth-token") as string;
	if(!currentToken){
		return json({ error: 'You are not logged' }, { status: 400 });
	}

	//Get user data
	const user = await bdd.getPlayer(currentToken);
	if(!user){
		return json({ error: 'Bad token' }, { status: 400 });
	}

	const { rows, bet } = await request.json();

	//Check if user have enough money
	if(user.balance < bet){
		return json({ error: 'You dont have enough money' }, { status: 400 });
	}

	//Update user balance
	user.balance -= bet;

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

	//Update user balance
	user.balance += result.reward;

	//Update user data
	await bdd.updatePlayer(user);

	const newBalance = user.balance;

	return json({ matrix : symbolMatrix, bonus, wildPosition, result, newBalance });
}