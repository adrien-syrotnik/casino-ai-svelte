<svelte:options accessors />

<script lang="ts">
	import { onMount } from 'svelte';

	//Import tweening library

	import Symbol from './symbol.svelte';
	import { getRandSymbol, type SlotSymbol } from '$lib/symbols';
	let SymbolsNodes: {
		initY: number;
		spinY: number;
		symbol: SlotSymbol;
		duration?: number;
		node?: any;
	}[] = [];

	onMount(() => {
		// Init 3 symbols
		for (let i = 0; i < 5; i++) {
			SymbolsNodes.push({
				initY: 100,
				spinY: 2000,
				symbol: getRandSymbol()
			});
		}

		//Refresh symbols
		SymbolsNodes = [...SymbolsNodes];

		//Console log the last symbol after 5 seconds
		// setTimeout(() => {
		// 	console.log(SymbolsNodes[29].symbol.name);
		// }, 5000);
	});

	export let currentSymbols = ["", "", ""];
	export let currentSymbolsNode = [null, null, null];

	export function spinAllSymbols() {
		//If more than 25 symbols, keep only the first 5
		let last5Symbols = SymbolsNodes.slice(-5);
		// console.log(last5Symbols.map((s) => s.symbol.name));

		//reset SymbolsNodes
		SymbolsNodes = [];
		SymbolsNodes = [...SymbolsNodes];

		setTimeout(() => {
			//Init 25 symbols next symbols with last 5 symbols at the end
			for (let i = 0; i < 25; i++) {
				if (i > 19) {
					SymbolsNodes.push({
						initY: 2100,
						spinY: 2000,
						// duration: 5000,
						symbol: last5Symbols[i - 20].symbol
					});
				} else {
					SymbolsNodes.push({
						initY: 2100,
						spinY: 2000,
						// duration: 5000,
						symbol: getRandSymbol()
					});
				}
			}

			// Set current symbols (1 - 3)
			currentSymbols = SymbolsNodes.slice(1, 4).map((s) => s.symbol.name);

			// console.log(SymbolsNodes.map((s) => s.symbol.name));

			//Refresh symbols
			SymbolsNodes = [...SymbolsNodes];

			setTimeout(() => {
				currentSymbolsNode = SymbolsNodes.slice(1, 4).map((s) => s.node);

				//Spin all symbols
				SymbolsNodes.forEach((symbolNode, i) => {
					symbolNode.node.spin();
				});
			});
		});
	}
</script>

<div class="symbols">
	{#each SymbolsNodes as SymbolNode}
		<Symbol {...SymbolNode} bind:this={SymbolNode.node} />
	{/each}
</div>

<style>

</style>
