<script lang="ts">
	import SlotReel from './slot-reel.svelte';
	import { onDestroy, onMount } from 'svelte';
	import PlayerBar from './player-bar.svelte';
	import ImageGeneratorBar from './image-generator-bar.svelte';
	import type { SlotConfig, SlotSymbol } from '$lib/symbols.types';
	import { enhance } from '$app/forms';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { triggerClose, triggerWin } from '$lib/win-modal-store';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';

	onMount(() => {
		if (localStorage.getItem('balance')) balance = Number(localStorage.getItem('balance')!);
		localStorageLoaded = true;
	});

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

		await new Promise((resolve) => setTimeout(resolve, 20));

		currentWinLineSymbol = '';
		currentWinLineReward = 0;
		currentWinLineNumberOfSymbols = 0;
		
	}

	let localStorageLoaded = false;

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
		}, 2000);

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
			alert('Not enough money');
			return;
		}

		//Play sound
		audioSpin.currentTime = 0;
		audioSpin.play();

		clearTimeout(winLinesAnimationTimeout);
		StopAnimateWinLine();

		winLinesAnimationTab = [];
		indexWinLine = 0;

		currentBet = bet;
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

			if (result.reward > 8) {
				//Wait 2 seconds for playing rising sound
				audioRise.currentTime = 0.5;
				await audioRise.play();
				//zoom in
				zoomWin.set(1.1, { duration: 500, easing: cubicInOut });
				await new Promise((resolve) => setTimeout(resolve, 500));

				zoomWin.set(0.95, { duration: 500, easing: cubicInOut });
				await new Promise((resolve) => setTimeout(resolve, 500));

				//zoom out
				zoomWin.set(1, { duration: 200, easing: cubicInOut });
				audioRise.pause();
				audioRise.currentTime = 0;

				triggerWin.set({ win: result.reward, bet });
				await WaitForWinClose();
			} else if (result.reward > 0) {
				audioSmallWin.currentTime = 0;
				audioSmallWin.play();
			}
			

			reward = result.reward * bet;
			balance += reward;

			localStorage.setItem('balance', balance.toString());

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
		}, 1200);
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

	let currentBet = 0;

	onDestroy(() => {
		clearTimeout(winLinesAnimationTimeout);
		clearTimeout(autoSpinTimeout);
	});

	let isWinModalOpen = false;

	let audioRise: HTMLAudioElement;
	let audioSpin: HTMLAudioElement;
	let audioSmallWin: HTMLAudioElement;

	let zoomWin = tweened(1, { duration: 1000, easing: cubicInOut });
	let slot_width = 765;
	let slot_height = 480;

	async function WaitForWinClose() {
		triggerClose.set(0);
		isWinModalOpen = true;
		let unsubscribe: any;

		await new Promise((resolve) => {
			unsubscribe = triggerClose.subscribe((event) => {
				if (event == 1) {
					isWinModalOpen = false;
					resolve('');
				}
			});
		});
		unsubscribe();
	}
</script>

<audio bind:this={audioSpin} id="spinSound" src="/musics/click.ogg" volume="1" preload="auto"></audio>
<audio bind:this={audioRise} id="riseSound" src="/musics/rise.ogg" preload="auto"></audio>
<audio bind:this={audioSmallWin} id="smallWinSound" src="/musics/small_win.mp3" preload="auto"></audio>

<div class="container justify-center mx-auto flex flex-col text-center">
	{#if localStorageLoaded}
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

		<div
			class="slot-machine justify-center mx-auto"
			style="width: {slot_width * $zoomWin}px; height: {slot_height * $zoomWin}px;"
		>
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
				x {currentWinLineNumberOfSymbols} = {currentWinLineReward} x {currentBet}€ = {currentWinLineReward *
					currentBet}€
			{:else if reward > 0 && spinEnabled == true}
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
	{:else}
		<div class="p-4 space-y-4">
			<div class="placeholder mt-3" style="height: 40px; border-radius: 10px;" />
			<div class="placeholder mx-auto" style="height: 300px; border-radius: 10px; width: 50%;" />
			<div class="placeholder" style="height: 40px; border-radius: 10px;" />
		</div>
	{/if}
</div>

<style>
	.slot-machine {
		margin-top: 20px;
		display: flex;
		overflow: hidden;
		background-color: #1a202c;
		/* width: 765px;
		height: 480px; */
		align-items: center;
		border-radius: 15px;
	}

	.reel {
		width: 150px;
		height: 453px;
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
		height: 150px;
		/* margin-bottom: 5px; */
		/* box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); */
	}
</style>
