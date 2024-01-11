<script lang="ts">
	import { triggerClose, triggerWin } from '$lib/win-modal-store';
	import { onDestroy, onMount } from 'svelte';
	import { cubicInOut, cubicOut, quintOut } from 'svelte/easing';
	import { tweened, type Unsubscriber } from 'svelte/motion';
	import { scale } from 'svelte/transition';

	onMount(() => {});

	let bonusSound: HTMLAudioElement;

	let sizeTime = tweened(160, {
		duration: 5000,
		easing: cubicOut
	});

	export async function StartAnimation() {
		show = true;

		bonusSound.currentTime = 0;
		await bonusSound.play();
		//Wait 500ms
		await new Promise((r) => setTimeout(r, 500));

		//FInalyse by increasing the size a little bit
		await sizeTime.set(90 + 30, { duration: 1000, easing: cubicInOut });
		// await sizeTime.set(120 + 30, { duration: 200, easing: cubicInOut });
		sizeTime.set(140 + 20, { duration: 1000, easing: cubicInOut });

		//Wait 2 seconds
		await new Promise((r) => setTimeout(r, 1000));
		sizeTime.set(160, { duration: 0 });
		show = false;
	}

	let show = false;
</script>

<audio bind:this={bonusSound} id="smallWinSound" src="/musics/bonus.mp3" preload="auto"></audio>

{#if show}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="modal-reward flex flex-col justify-center items-center"
		transition:scale={{ duration: 500, easing: quintOut }}
	>
		<div
			style="font-size: {$sizeTime}px; opacity: 1; height: {$sizeTime}px; font-family: 'StardosStencilBold-9mzn';"
		>
			BONUS
		</div>
		<div style="font-size: {$sizeTime - 70}px; opacity: 1; font-family: 'StardosStencilBold-9mzn';">
			Wild x5
		</div>
	</div>
{/if}

<style>
	@font-face {
		font-family: 'StardosStencilBold-9mzn';
		src: url('fonts/new/StardosStencilBold-9mzn.ttf');
	}

	.modal-reward {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 100;

		position: fixed;
		top: 50%;
		left: 50%;
		/* bring your own prefixes */
		transform: translate(-50%, -50%);

		/* gold color */
		color: #ffd700;

		overflow: visible;
		text-shadow: -5px 0 black, 0 5px black, 5px 0 black, 0 -5px black;
	}
</style>
