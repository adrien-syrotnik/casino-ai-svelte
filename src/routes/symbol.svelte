<script lang="ts">
    import { spring, tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

    import { DEFAULT_SYMBOLS, getRandSymbol } from "$lib/symbols";
	import { onMount } from 'svelte';
	export let symbol = DEFAULT_SYMBOLS[0];

    let symbolNode: any = null;

    export let initY = 0;

    export function spin() {
        //Get node position
        yPos.set(spinY);
    }

    export let duration = 5000;
    
	// let yPos = tweened(0, {
	// 	duration,
	// 	easing: cubicOut
	// });

    let yPos = spring(0, {
        stiffness: 0.1,
        damping: 0.1,
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
<div bind:this={symbolNode} style="transform: translateY({$yPos - initY}px); background-image: url('{symbol?.image}');" class="symbol flex justify-center items-center text-3xl">{symbol ? (symbol.image ? '' : symbol.name) : '' }</div>
{/if}
<style>
    .symbol {
        background-size: 80px 80px;
        background-repeat: no-repeat;
        background-position: center;
    }
</style>