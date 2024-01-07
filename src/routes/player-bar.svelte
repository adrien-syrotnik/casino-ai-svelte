<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const onSpin = () => {
		dispatch('spin');
	};

	const onAutoSpin = () => {
		dispatch('autoSpin');
	};

	export let bet = 200;

	function increment() {
		bet += 20;
	}

	function decrement() {
		bet -= 20;
	}

	export let win = 0;
	export let balance = 0;

	export let spinEnabled = true;
</script>

<div id="player-bar">
	<!-- less button -->
	<button on:click={decrement} type="button" class="btn-icon btn-icon-sm variant-filled-error"
		>-</button
	>
	<!-- value -->
	<div class="mx-2 text-2xl">
		<span>
			{bet}
		</span>
		<br />
		<small> BET </small>
	</div>
	<!-- more button -->
	<button on:click={increment} type="button" class="btn-icon btn-icon-sm variant-filled-success"
		>+</button
	>

	<!-- win -->
	<div class="mx-3 text-2xl">
		<span>
			{win}€
		</span>
		<br />
		<small> WIN </small>
	</div>

	<!-- balance -->
	<div class="mx-2 text-2xl">
		<span>
			{balance}€
		</span>
		<br />
		<small> BALANCE </small>
	</div>

	<!-- auto spin button -->
	<button
		on:click={onAutoSpin}
        disabled={true}
		type="button"
		class="btn btn-md variant-filled text-xs ml-5 mr-2"
	>
		AUTO
	</button>

	<!-- spin button -->
	<button
		on:click={onSpin}
		disabled={!spinEnabled}
		type="button"
		class="btn-icon btn-icon-xl variant-filled-tertiary"
	>
		<img src="https://img.icons8.com/ios-filled/150/synchronize.png" alt="spin" class="w-10 h-10" />
	</button>
</div>

<style>
	#player-bar {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #1a202c;
		border-radius: 15px;
		padding: 10px;
	}
</style>
