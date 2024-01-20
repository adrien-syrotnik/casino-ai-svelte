<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { cubicOut, elasticInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	let xRoulette = tweened(0, {
		duration: 7000,
		easing: cubicOut
	});

	let numbers = [] as any[];

	let divContainer: HTMLDivElement;

	const widthSymbol = 100;
	const margeXSymbol = 0;

	onMount(async () => {
		//Random starting position
		// await xRoulette.set(-10000 * Math.random());

		for (let i = 0; i < 18; i++) {
			numbers.push({
				number: i,
				color: i % 2 == 0 ? 'black' : 'red',
				offset: 0
			});
		}
		//Refresh numbers
		numbers = [...numbers];

		await tick();
		// Spin();
	});

	let currentNumber = 3;

	let isSpinning = false;

	let oldXWithoutRand = 0;

	async function Spin() {
		const randomNumber = Math.floor(Math.random() * 18);
		console.log(randomNumber);
		SpinAnimation(randomNumber);
	}

	async function SpinAnimation(randomNumber: number) {
		if (isSpinning) return;

		isSpinning = true;

		//Random number between 0 and 18
		const numberOfSpinsAnimation = 5;

		const offset =
			(randomNumber - currentNumber > 0
				? randomNumber - currentNumber
				: randomNumber - currentNumber + 18) +
			numberOfSpinsAnimation * 18;

		const numberOffset = oldXWithoutRand + offset * -(widthSymbol + margeXSymbol);
		oldXWithoutRand = numberOffset;

		//Random between -(widthSymbol + margeXSymbol)/2 - 1 and (widthSymbol + margeXSymbol)/2 + 1
		const xRandomWidth =
			Math.random() * (widthSymbol + margeXSymbol - 1) - (widthSymbol + margeXSymbol - 1) / 2;

		await xRoulette.set(numberOffset + xRandomWidth);

		currentNumber = randomNumber;
		isSpinning = false;

		//Optimisiation part (avoiding memory leak)
		// let allOffsetDone = true;

		// for (let i = 0; i < numbers.length; i++) {
		// 	if (numbers[i].offset == 0) {
		// 		allOffsetDone = false;
		// 	}
		// }

		// if (allOffsetDone) {
		// 	console.log('Reseting offset');
		// 	console.log($xRoulette);
		// 	console.log($xRoulette % 1800);
		// 	console.log($xRoulette - ($xRoulette % 1800));
		// 	for (let i = 0; i < numbers.length; i++) {
		// 		numbers[i].offset = 0;
		// 	}
		// 	xRoulette.set(($xRoulette % 1800), { duration: 0 });
		// }
	}

	xRoulette.subscribe((value) => {
		for (let i = 0; i < numbers.length; i++) {
			if (numbers[i].node) {
				//Check if x position of node is less than divContainer start X - (widthSymbol + margeXSymbol)
				if (
					numbers[i].node.getBoundingClientRect().x <
					divContainer.getBoundingClientRect().x - (widthSymbol + margeXSymbol)
				) {
					numbers[i].offset += 18 * (widthSymbol + margeXSymbol);
				}

				//Check if x position of node is more than divContainer width + (widthSymbol + margeXSymbol)
				if (
					numbers[i].node.getBoundingClientRect().x >
					divContainer.getBoundingClientRect().x +
						divContainer.getBoundingClientRect().width +
						(widthSymbol + margeXSymbol)
				) {
					numbers[i].offset -= 18 * (widthSymbol + margeXSymbol);
				}
			}
		}
	});

	let bet = 1;
</script>


	<div class="container mx-auto my-5 card text-center" style="width: 80%; padding: 20px;">
		<h1 style="font-size: 50px; margin-top: 10px; margin-bottom: 30px;">Roulette</h1>
		<div class="flex justify-center my-5">
			<button class="btn variant-filled-warning" on:click={Spin}>Spin</button>
			<input type="number" class="input" value={bet} min="1" placeholder="Bet"/>
		</div>
		<div class="roulette-container mx-auto flex" bind:this={divContainer}>
			{#each numbers as number}
				<div
					bind:this={number.node}
					class="roulette-number text-center flex justify-center mx-auto"
					style="transform: translateX({$xRoulette +
						number.offset}px); width: {widthSymbol}px; height: {widthSymbol}px; margin-right: {margeXSymbol}px; margin-left: {margeXSymbol}px;"
					class:roulette-black={number.number % 2 == 0}
					class:roulette-green={number.number == 0}
				>
					<span style="width: 100px; display: flex; justify-content: center;"></span>{number.number}
				</div>
			{/each}
			<div class="vertical-bar"></div>
		</div>
		<h1 style="font-size: 50px; margin-top: 30px; margin-bottom: 10px;">{currentNumber}</h1>
	</div>


<style>
	.roulette-container {
		width: 700px;
		height: 100px;
		overflow: hidden;
		position: relative;
		outline: 2px solid #000000;
		border-radius: 10px;
	}

	.roulette-number {
		/* width: 100px;
		height: 100px; */
		border-radius: 50%;
		background-color: #ff0000;
		color: #ffffff;
		display: grid;
		font-size: 50px;
	}

	.roulette-black {
		background-color: #000000;
	}

	.roulette-green {
		background-color: #00ff00;
	}

	.vertical-bar {
		width: 5px;
		height: 100%;
		background-color: #000000;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
