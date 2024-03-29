<script lang="ts">
	import SlotReel from './slot-reel.svelte';
	import { onDestroy, onMount, tick } from 'svelte';
	import PlayerBar from './player-bar.svelte';
	import ImageGeneratorBar from './image-generator-bar.svelte';
	import type { SlotConfig, SlotSymbol } from '$lib/symbols.types';
	import { enhance } from '$app/forms';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { triggerClose, triggerWin } from '$lib/win-modal-store';
	import { tweened } from 'svelte/motion';
	import { cubicInOut, elasticInOut } from 'svelte/easing';
	import AnimationBonus from './animation-bonus.svelte';
	import type { PlayerData } from '$lib/bdd-types';
	import { page } from '$app/stores';
	import { currentMusicConfig, player } from '$lib/player-store';

	onMount(async () => {
		page.subscribe((page) => {
			if (page.data && page.data.player) {
				player.set(page.data.player as PlayerData);
				onDataLoaded();
			}
		});
	});

	const modalStore = getModalStore();

	/** @type {import('./$types').PageData} */
	export let data;

	export let SYMBOLS = data.symbols as SlotSymbol[];
	const currentConfig = data.currentConfig as SlotConfig;
	const allConfigs = data.allConfigs as string[];

	const allMusicConfigs = ['Suno', 'Indestructible'];

	const modal: ModalSettings = {
		type: 'component',
		component: 'rewardsModal',
		meta: {
			SYMBOLS: SYMBOLS
		}
	};

	let Slotreel = [null, null, null, null, null] as any[];

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

		await tick();
		await new Promise((resolve) => setTimeout(resolve, 20));

		currentWinLineSymbol = '';
		currentWinLineReward = 0;
		currentWinLineNumberOfSymbols = 0;
	}

	function SpinReels(reel: number, symbols: SlotSymbol[]) {
		Slotreel[reel].spinAllSymbols(symbols);
	}

	let reward = 0;

	$: balance = $player.balance;
	let bet = 1;

	let spinEnabled = true;

	let autoSpinLeft = 0;
	let autoSpinTimeout: any = null;
	async function StartAutoSpin(numberOfTime: number) {
		if (numberOfTime <= 0) {
			StopAutoSpin();
			return;
		}

		//start auto spin
		autoSpinLeft = numberOfTime - 1;
		await SpinAllDelay();

		//Wait 1s
		await new Promise((resolve) => setTimeout(resolve, 600));

		if (autoSpinLeft > 0) {
			StartAutoSpin(autoSpinLeft);
		}
	}

	function StopAutoSpin() {
		clearTimeout(autoSpinTimeout);
		autoSpinTimeout = null;
		autoSpinLeft = 0;
	}

	async function SpinAllDelay(delayBetween: number = 100) {
		if (balance < bet) {
			alert('Not enough money');
			return;
		}

		if (bet <= 0) {
			alert('Bet must be greater than 0');
			return;
		}

		spinEnabled = false;

		const responseSpin = await fetch('/api/slot/spin', {
			method: 'POST',
			body: JSON.stringify({ rows: 25, bet: bet }),
			headers: {
				'content-type': 'application/json'
			}
		});

		const responseSpinObject = await responseSpin.json();
		const spinMatrix = responseSpinObject.matrix as SlotSymbol[][]; //5 rows, 5 columns

		const symbolsReel1 = spinMatrix[0];
		const symbolsReel2 = spinMatrix[1];
		const symbolsReel3 = spinMatrix[2];
		const symbolsReel4 = spinMatrix[3];
		const symbolsReel5 = spinMatrix[4];

		//If bonus is true, then play bonus animation
		if (responseSpinObject.bonus) {
			bonusEarthQuake.currentTime = 0;
			await bonusEarthQuake.play();
			//Make the slot tremble
			for (let i = 0; i < 10; i++) {
				await zoomWin.set(1.01, { duration: 30, easing: cubicInOut });
				await zoomWin.set(1, { duration: 30, easing: cubicInOut });
			}

			volumeEarthQuake.set(0, { duration: 400, easing: cubicInOut }).then(() => {
				bonusEarthQuake.pause();
				bonusEarthQuake.currentTime = 0;
				volumeEarthQuake.set(1, { duration: 0 });
			});

			//Wait 0.5s
			await new Promise((resolve) => setTimeout(resolve, 500));
			//Play bonus animation
			await animationBonusNode.StartAnimation(responseSpinObject.wildPosition.length);
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

		SpinReels(0, symbolsReel1);
		setTimeout(() => {
			SpinReels(1, symbolsReel2);
		}, delayBetween);
		setTimeout(() => {
			SpinReels(2, symbolsReel3);
		}, delayBetween * 2);
		setTimeout(() => {
			SpinReels(3, symbolsReel4);
		}, delayBetween * 3);
		setTimeout(() => {
			SpinReels(4, symbolsReel5);
		}, delayBetween * 4);

		//Wait 1 second
		await new Promise((resolve) => setTimeout(resolve, 1000));

		let result: {
			lines: {
				reelAndRow: number[][];
				reward: number;
				symbol: string;
				numberOfSymbol: number;
			}[];
			reward: number;
		} = responseSpinObject.result;

		if (result.reward > 10) {
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

		//Fix balance using responseSpinObject.newBalance
		balance = responseSpinObject.newBalance;

		// balance += reward;

		// //Check that balance is decimal fixed to 2
		// balance = Math.round(balance * 100) / 100;

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
	let bonusEarthQuake: HTMLAudioElement;

	let volumeEarthQuake = tweened(1, { duration: 1000, easing: cubicInOut });

	let zoomWin = tweened(1, { duration: 1000, easing: cubicInOut });
	let slot_width = 765;
	let slot_height = 480;

	let animationBonusNode: AnimationBonus;

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

	let isAllImageLoaded = false;
	let nbImagesLoaded = 0;

	async function LoadAllImages() {
		console.log('LoadAllImages');
		await Promise.all(
			SYMBOLS.map(async (symbol) => {
				const img = new Image();
				if (symbol.image) {
					img.src = symbol.image;
					await new Promise((resolve) => {
						img.onload = () => {
							nbImagesLoaded++;
							resolve('');
						};
					});
				}
			})
		);
		isAllImageLoaded = true;
	}

	async function onDataLoaded() {
		const responseSpinMatrix = fetch('/api/slot/random-symbol', {
			method: 'POST',
			body: JSON.stringify({ rows: 5 }),
			headers: {
				'content-type': 'application/json'
			}
		});

		await LoadAllImages();

		const json = await (await responseSpinMatrix).json();
		const spinMatrix = json.matrix as SlotSymbol[][]; //5 rows, 5 columns

		const initSymbolsReel = [
			spinMatrix[0],
			spinMatrix[1],
			spinMatrix[2],
			spinMatrix[3],
			spinMatrix[4]
		];

		//Init all reels
		Slotreel.forEach((reel: SlotReel, i) => {
			reel.InitSymbols(initSymbolsReel[i]);
		});
	}
</script>

<AnimationBonus bind:this={animationBonusNode}></AnimationBonus>

<audio bind:this={audioSpin} id="spinSound" src="/musics/click.ogg" volume="1" preload="auto"
></audio>
<audio bind:this={audioRise} id="riseSound" src="/musics/rise.ogg" preload="auto"></audio>
<audio bind:this={audioSmallWin} id="smallWinSound" src="/musics/small_win.mp3" preload="auto"
></audio>
<audio
	bind:this={bonusEarthQuake}
	id="bonusEarthQuakeSound"
	src="/musics/earthquake.wav"
	bind:volume={volumeEarthQuake}
	preload="auto"
></audio>

<div class="container justify-center mx-auto flex flex-col text-center" style="width: 1000px;">
	{#if SYMBOLS.length > 0 && isAllImageLoaded}
		<form method="post" use:enhance class="flex justify-around">
			<div class="w-50">
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
			</div>
			<div>
				<span>Select a music</span>
				<select
					class="select"
					bind:value={$currentMusicConfig}
					onchange="this.form.submit()"
					name="musicChoose"
				>
					{#each allMusicConfigs as config}
						<option value={config}>{config}</option>
					{/each}
				</select>
			</div>
		</form>

		<div
			class="slot-machine justify-center mx-auto"
			style="width: {slot_width * $zoomWin}px; height: {slot_height * $zoomWin}px;"
		>
			<div class="reel">
				<SlotReel bind:this={Slotreel[0]} bind:SYMBOLS />
			</div>
			<div class="reel">
				<SlotReel bind:this={Slotreel[1]} bind:SYMBOLS />
			</div>
			<div class="reel">
				<SlotReel bind:this={Slotreel[2]} bind:SYMBOLS />
			</div>
			<div class="reel">
				<SlotReel bind:this={Slotreel[3]} bind:SYMBOLS />
			</div>
			<div class="reel">
				<SlotReel bind:this={Slotreel[4]} bind:SYMBOLS />
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
			<div class="placeholder animate-pulse mt-3" style="height: 40px; border-radius: 10px;" />
			<div
				class="placeholder animate-pulse mx-auto"
				style="width: {slot_width * $zoomWin}px; height: {slot_height *
					$zoomWin}px; border-radius: 15px;"
			/>
			<div class="placeholder animate-pulse" style="height: 40px; border-radius: 10px;" />

			<!-- Show poucentage of image loaded: absolute position in the middle of the div: -->
			<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				{Math.round((nbImagesLoaded / SYMBOLS.length) * 100)}%
			</div>
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
