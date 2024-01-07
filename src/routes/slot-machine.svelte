<script lang="ts">
	import SlotReel from './slot-reel.svelte';
	import { DEFAULT_SYMBOLS, checkLines25, getRandSymbol } from '$lib/symbols';
	import { onMount } from 'svelte';
	import PlayerBar from './player-bar.svelte';
	import ImageGeneratorBar from './image-generator-bar.svelte';
	let symbol = DEFAULT_SYMBOLS[0];
	let Slotreel = [null, null, null, null, null] as any;

	function AnimateWinLine(line: { reelAndRow: number[][]; reward: number; symbol: string; numberOfSymbol: number }) {
		line.reelAndRow.forEach((pos) => {
			const reel = pos[0];
			const row = pos[1];
			//Add class win to the .symbol div, first child of the .reel div
			const symbolNode = Slotreel[reel].currentSymbolsNode[row].$$.ctx[2];
			const child = symbolNode.children[0];
			child.classList.add('win');
		});

		currentWinLineSymbol = line.symbol;
		currentWinLineReward = line.reward;
		currentWinLineNumberOfSymbols = line.numberOfSymbol;
	}

	async function StopAnimateWinLine() {
		//Await setTimeout to wait for the animation to finish
		winLinesAnimationTab.forEach((line) => {
			line.reelAndRow.forEach((pos) => {
				const reel = pos[0];
				const row = pos[1];
				//Add class win to the .symbol div, first child of the .reel div
				const symbolNode = Slotreel[reel].currentSymbolsNode[row].$$.ctx[2];
				const child = symbolNode.children[0];
				child.classList.remove('win');
			});
		});
		currentWinLineSymbol = '';
		currentWinLineReward = 0;
		currentWinLineNumberOfSymbols = 0;
		await new Promise((resolve) => setTimeout(resolve, 1));
	}

	onMount(() => {});

	function SpinReels(reel: number) {
		Slotreel[reel].spinAllSymbols();
	}

	let reward = 0;

	let balance = 6000;
	let bet = 200;

	let spinEnabled = true;

	function SpinAllDelay(delayBetween: number = 100) {
		if (balance < bet) {
			return;
		}

		clearTimeout(winLinesAnimationTimeout);
		StopAnimateWinLine();

		winLinesAnimationTab = [];
		indexWinLine = 0;

		balance -= bet;

		SpinReels(0);
		setTimeout(() => {
			SpinReels(1);
		}, delayBetween);
		setTimeout(() => {
			SpinReels(2);
		}, delayBetween * 2);
		setTimeout(() => {
			SpinReels(3);
		}, delayBetween * 3);
		setTimeout(() => {
			SpinReels(4);
		}, delayBetween * 4);

		spinEnabled = false;

		setTimeout(() => {
			const symbolReel = Slotreel.map((r: any) => r.currentSymbols) as [
				string[],
				string[],
				string[],
				string[],
				string[]
			];
			let result = checkLines25(...symbolReel);

			reward = result.reward;
			balance += result.reward;

			winLinesAnimationTab = result.lines;

			if (result.lines.length > 0) {
				result.lines.forEach((line) => {
					AnimateWinLine(line);
				});
				winLinesAnimationTimeout = setTimeout(async () => {
					await StopAnimateWinLine();
					AnimateLineIndividually();
				}, 2500);
			}

			spinEnabled = true;
		}, 2000);
	}

	let winLinesAnimationTab: {
		reelAndRow: number[][];
		reward: number;
		symbol: string;
		numberOfSymbol: number;
	}[] = [];
	let indexWinLine = 0;

	let winLinesAnimationTimeout: any;

	function AnimateLineIndividually() {
		if (indexWinLine >= winLinesAnimationTab.length) {
			indexWinLine = 0;
		}
		AnimateWinLine(winLinesAnimationTab[indexWinLine]);
		indexWinLine++;
		winLinesAnimationTimeout = setTimeout(async () => {
			await StopAnimateWinLine();
			AnimateLineIndividually();
		}, 2500);
	}

	let currentWinLineSymbol = '';
	let currentWinLineReward = 0;
	let currentWinLineNumberOfSymbols = 0;
</script>

<div class="container justify-center mx-auto flex flex-col text-center" style="margin-top: 200px;">
	<div class="slot-machine justify-center mx-auto">
		<div class="reel">
			<SlotReel bind:this={Slotreel[0]} />
		</div>
		<div class="reel">
			<SlotReel bind:this={Slotreel[1]} />
		</div>
		<div class="reel">
			<SlotReel bind:this={Slotreel[2]} />
		</div>
		<div class="reel">
			<SlotReel bind:this={Slotreel[3]} />
		</div>
		<div class="reel">
			<SlotReel bind:this={Slotreel[4]} />
		</div>
	</div>

	<div class="flex justify-center" style="height: 20px;">
		{#if currentWinLineSymbol != ''}
			Win Line:&nbsp;<img
				style="width: 20px; height: 20px;"
				src={DEFAULT_SYMBOLS.find((s) => s.name == currentWinLineSymbol)?.image}
				alt=""
			/>
			x {currentWinLineNumberOfSymbols} = {currentWinLineReward}€
		{/if}
	</div>

	<PlayerBar
		bind:bet
		bind:win={reward}
		bind:spinEnabled
		bind:balance
		on:spin={() => SpinAllDelay()}
	/>

	<ImageGeneratorBar />
</div>

<style>
	.slot-machine {
		display: flex;
		overflow: hidden;
		background-color: darkblue;
		width: 560px;
		height: 320px;
		align-items: center;
		border-radius: 15px;
	}

	.reel {
		width: 100px;
		height: 304px;
		border: 2px solid #333;
		margin: 0 5px;
		background-color: #000;
		overflow: hidden;
		border-radius: 15px;
	}

	:global(.symbols) {
		display: flex;
		flex-direction: column;
	}

	:global(.symbol) {
		width: 100%;
		height: 100px;
		/* margin-bottom: 5px; */
		/* box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); */
	}
</style>
