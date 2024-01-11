<svelte:options accessors />

<script lang="ts">
	import { onMount } from 'svelte';

	//Import tweening library

	import Symbol from './symbol.svelte';
	import type { SlotSymbol } from '$lib/symbols.types';
	let SymbolsNodes: {
		initY: number;
		spinY: number;
		symbol: SlotSymbol;
		duration?: number;
		node?: any;
	}[] = [];

	onMount(async () => {
		// Init 3 symbols
		for (let i = 0; i < 5; i++) {
			const response = await fetch('/api/slot/random-symbol', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				}
			});

			const symbol = (await response.json()) as SlotSymbol;

			SymbolsNodes.push({
				initY: 150,
				spinY: 2000,
				symbol: symbol
			});
		}

		//Refresh symbols
		SymbolsNodes = [...SymbolsNodes];

		//Console log the last symbol after 5 seconds
		// setTimeout(() => {
		// 	console.log(SymbolsNodes[29].symbol.name);
		// }, 5000);
	});

	export let currentSymbols = ['', '', ''];
	export let currentSymbolsNode = [null, null, null];

	export function spinAllSymbols() {
		//If more than 25 symbols, keep only the first 5
		let last5Symbols = SymbolsNodes.slice(-5);
		// console.log(last5Symbols.map((s) => s.symbol.name));

		//reset SymbolsNodes

		setTimeout(async () => {
			// SymbolsNodes = [];
			// SymbolsNodes = [...SymbolsNodes];
			let SymbolsNodesTemp: any[] = [];

			//Init 25 symbols next symbols with last 5 symbols at the end
			for (let i = 0; i < 25; i++) {
				if (i > 19) {
					SymbolsNodesTemp.push({
						initY: 2150,
						spinY: 2000,
						// duration: 5000,
						symbol: last5Symbols[i - 20].symbol
					});
				} else {
					const response = await fetch('/api/slot/random-symbol', {
						method: 'POST',
						headers: {
							'content-type': 'application/json'
						}
					});

					const symbol = (await response.json()) as SlotSymbol;
					SymbolsNodesTemp.push({
						initY: 2150,
						spinY: 2000,
						// duration: 5000,
						symbol: symbol
					});
				}
			}

			// Set current symbols (1 - 3)
			currentSymbols = SymbolsNodesTemp.slice(1, 4).map((s) => s.symbol.name);

			// console.log(SymbolsNodes.map((s) => s.symbol.name));

			SymbolsNodes = [];

			setTimeout(() => {
				//Refresh symbols
				SymbolsNodes = [...SymbolsNodesTemp];
				setTimeout(() => {
					currentSymbolsNode = SymbolsNodes.slice(1, 4).map((s) => s.node);

					//Spin all symbols
					SymbolsNodes.forEach((symbolNode, i) => {
						symbolNode.node.spin();
					});
				});
			});

			setTimeout(() => {
				//After spin, play sound
				audioReel.currentTime = 0;
				audioReel.play();
			}, 100);
		});
	}

	let audioReel: HTMLAudioElement;
</script>

<audio bind:this={audioReel} id="reelSound" src="/musics/click-grave.ogg" volume="0.1" preload="auto"></audio>

<div class="symbols">
	{#each SymbolsNodes as SymbolNode}
		<Symbol {...SymbolNode} bind:this={SymbolNode.node} />
	{/each}
</div>

<style>
</style>
