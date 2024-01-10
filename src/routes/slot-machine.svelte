<script lang="ts">
	import SlotReel from './slot-reel.svelte';
	import { onDestroy, onMount } from 'svelte';
	import PlayerBar from './player-bar.svelte';
	import ImageGeneratorBar from './image-generator-bar.svelte';
	import type { SlotConfig, SlotSymbol } from '$lib/symbols.types';
	import { enhance } from '$app/forms';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	/** @type {import('./$types').PageData} */
	export let data;

	export const SYMBOLS = data.symbols as SlotSymbol[];
	const currentConfig = data.currentConfig as SlotConfig;
	const allConfigs = data.allConfigs as string[];

	const modal: ModalSettings = {
		type: 'component',
		component: 'rewardsModal',
		meta: {
			SYMBOLS: SYMBOLS
		}
	};

	let Slotreel = [null, null, null, null, null] as any;

	function AnimateWinLine(line: {
		reelAndRow: number[][];
		reward: number;
		symbol: string;
		numberOfSymbol: number;
	}) {
		line.reelAndRow.forEach((pos) => {
			const reel = pos[0];
			const row = pos[1];
			//Add class win to the .symbol div, first child of the .reel div
			const symbolNode = Slotreel[reel].currentSymbolsNode[row].$$.ctx[2];
			const child = symbolNode.children[0];
			child.classList.add('win');
		});

		currentWinLineSymbol = line.symbol;
		//2 decimals
		currentWinLineReward = Math.round(line.reward * 100) / 100;
		currentWinLineNumberOfSymbols = line.numberOfSymbol;
	}

	async function StopAnimateWinLine() {
		//Await setTimeout to wait for the animation to finish
		winLinesAnimationTab.forEach((line) => {
			line.reelAndRow.forEach((pos) => {
				const reel = pos[0];
				const row = pos[1];
				//Add class win to the .symbol div, first child of the .reel div
				if (Slotreel[reel].currentSymbolsNode[row]) {
					const symbolNode = Slotreel[reel].currentSymbolsNode[row].$$.ctx[2];
					const child = symbolNode.children[0];
					child.classList.remove('win');
				}
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

	let balance = 500;
	let bet = 1;

	let spinEnabled = true;

	let autoSpinLeft = 0;
	let autoSpinTimeout: any = null;
	function StartAutoSpin(numberOfTime: number) {
		if (numberOfTime <= 0) {
			StopAutoSpin();
			return;
		}

		//start auto spin
		autoSpinLeft = numberOfTime;
		SpinAllDelay();

		//start auto spin timeout
		autoSpinTimeout = setTimeout(() => {
			if (autoSpinLeft > 0) {
				StartAutoSpin(autoSpinLeft);
			}
		}, 3000);

		//decrement auto spin left
		autoSpinLeft--;
	}

	function StopAutoSpin() {
		clearTimeout(autoSpinTimeout);
		autoSpinTimeout = null;
		autoSpinLeft = 0;
	}

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

		setTimeout(async () => {
			const symbolReel = {
				reel1: Slotreel[0].currentSymbols,
				reel2: Slotreel[1].currentSymbols,
				reel3: Slotreel[2].currentSymbols,
				reel4: Slotreel[3].currentSymbols,
				reel5: Slotreel[4].currentSymbols
			};

			const response = await fetch('/api/slot/spin', {
				method: 'POST',
				body: JSON.stringify(symbolReel),
				headers: {
					'content-type': 'application/json'
				}
			});

			let result: {
				lines: {
					reelAndRow: number[][];
					reward: number;
					symbol: string;
					numberOfSymbol: number;
				}[];
				reward: number;
			} = await response.json();

			reward = result.reward * bet;
			balance += reward;

			//Check that balance is decimal fixed to 2
			balance = Math.round(balance * 100) / 100;

			winLinesAnimationTab = result.lines;

			if (result.lines.length > 0) {
				result.lines.forEach((line) => {
					AnimateWinLine(line);
				});

				currentWinLineReward = reward;
				currentWinLineNumberOfSymbols = 0;
				currentWinLineSymbol = '';

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

	onDestroy(() => {
		clearTimeout(winLinesAnimationTimeout);
		clearTimeout(autoSpinTimeout);
	});
</script>

<div class="container justify-center mx-auto flex flex-col text-center">
	<form method="post" use:enhance>
		<label class="label">
			<span>Select a theme</span>
			<select
				class="select"
				bind:value={currentConfig.name}
				onchange="this.form.submit()"
				name="themeChoose"
			>
				{#each allConfigs as config}
					<option value={config}>{config}</option>
				{/each}
			</select>
		</label>
	</form>

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
				src={SYMBOLS.find((s) => s.name == currentWinLineSymbol)?.image}
				alt=""
			/>
			x {currentWinLineNumberOfSymbols} = {currentWinLineReward} x {bet}€ = {currentWinLineReward * bet}€
		{:else if reward > 0}
			Win:&nbsp;{reward}€
		{/if}
	</div>

	<PlayerBar
		bind:bet
		bind:win={reward}
		bind:spinEnabled
		bind:balance
		bind:autoSpinLeft
		on:spin={() => SpinAllDelay()}
		on:showRewards={() => modalStore.trigger(modal)}
		on:autoSpin={(numberOfTime) => StartAutoSpin(numberOfTime.detail)}
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
