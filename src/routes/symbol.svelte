<script lang="ts">
	import { spring, tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	import { onMount } from 'svelte';
	import type { SlotSymbol } from '$lib/symbols.types';

	export let symbol:SlotSymbol;

	let symbolNode: any = null;

	export let initY = 0;

	export function spin() {
		//Get node position
		yPos.set(spinY)
	}

	export let duration = 5000;

	// let yPos = tweened(0, {
	// 	duration,
	// 	easing: cubicOut
	// });

	let yPos = spring(0, {
		stiffness: 0.1,
		damping: 0.3,
		precision: 0.1
	});

	export let spinY = 3000;

	//Check if y is too high, then reset y
	// $: if ($yPos + initY > 800) {
	//     yLeft -= 800;
	//     yPos.set(0, { duration: 0 });

	//     yPos.set(yLeft);
	//     //destroy();
	// }

	onMount(() => {
		//Get node position
		// let initYNode = symbolNode.getBoundingClientRect().y;
		// yPos.set(initY, { duration: 0 });
		// spin();
	});
</script>

<!-- {$yPos + initY} -->

{#if symbol}
	<div
		bind:this={symbolNode}
		style="transform: translateY({$yPos - initY}px);"
		class="symbol flex justify-center items-center text-3xl"
	>
		<div class="symbol-image" style='background-image: url("{symbol?.image}");'>
			{symbol ? (symbol.image ? '' : symbol.name) : ''}
		</div>
	</div>
{/if}

<style>
	/* .symbol {
		position: relative;
    } */

	:global(.symbol-image) {
		background-size: 120px 120px;
		background-repeat: no-repeat;
		background-position: center;
		width: 100%;
		height: 100%;
		border-radius: 15px;
	}

	@keyframes spin {
		0% {
			transform: rotateY(0deg);
		}
		100% {
			transform: rotateY(360deg);
		}
	}
	@keyframes scale {
		0% {
			background-size: 120px 120px;
		}
		100% {
			background-size: 150px 150px;
		}
	}
	
	:global(.symbol-image.win) {
		border: 3px solid red;
		animation: spin 2s linear;
		background-size: 150px 150px;
		transition: background-size 0.5s ease-in-out;
	}

</style>
