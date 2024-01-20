<svelte:options accessors />

<script lang="ts">
	import { onMount } from 'svelte';
	import Symbol from './symbol.svelte';
	import type { SlotSymbol } from '$lib/symbols.types';

	export let SYMBOLS: SlotSymbol[] = [];

	let SymbolsNodes: {
		initY: number;
		spinY: number;
		symbol: SlotSymbol;
		duration?: number;
		node?: any;
	}[] = [];

	onMount(async () => {
	});

	export let currentSymbols = ['', '', ''];
	export let currentSymbolsNode = [null, null, null];

	//Only 5 symbols please
	export function InitSymbols(symbols: SlotSymbol[]) {

		for (let i = 0; i < 5; i++) {
			const symbol = symbols[i];
			SymbolsNodes.push({
				initY: 150,
				spinY: 2000,
				symbol: symbol
			});
		}

		//Add images to symbols
		SymbolsNodes.forEach((symbolNode, i) => {
			symbolNode.symbol.image = SYMBOLS.find((s) => s.name == symbolNode.symbol.name)?.image;
		});

		//Refresh symbols
		SymbolsNodes = [...SymbolsNodes];
	}

	export function spinAllSymbols(symbols: SlotSymbol[]) {
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
					const symbol = symbols[i];
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

			//Add images to symbols
			SymbolsNodesTemp.forEach((symbolNode, i) => {
				symbolNode.symbol.image = SYMBOLS.find((s) => s.name == symbolNode.symbol.name)?.image;
			});

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
