<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const onSpin = () => {
		dispatch('spin');
	};

	const onAutoSpin = (number: number) => {
		dispatch('autoSpin', number);
	};

	const onShowRewards = () => {
		dispatch('showRewards');
	};

	export let autoSpinLeft = 0;

	export let bet = 1;

	function increment() {
		if (bet + 1 < balance) bet += 1;
	}

	function decrement() {
		if (bet > 1) bet -= 1;
	}

	export let win = 0;
	export let balance = 0;

	export let spinEnabled = true;

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'top'
	};

	function onBetChange(e:any) {
		bet = e.target.value;
		if(bet <= 0) {
			bet = 1;
		} else if(bet > balance) {
			bet = balance;
		}
	}
</script>

<div id="player-bar">
	<button class="btn btn-icon variant-filled-warning mr-auto" on:click={onShowRewards}
		><b>?</b></button
	>

	<!-- less button -->
	<button on:click={decrement} type="button" class="btn-icon btn-icon-sm variant-filled-error"
		>-</button
	>
	<!-- value -->
	<div class="mx-2 text-2xl">
		<input type="number" class="input" value={bet} min="1" max={balance} on:change={onBetChange} />
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

	<!-- popup autospin -->
	<div class="card p-1 variant-filled" data-popup="popupClick">
		<button on:click={() => onAutoSpin(10)}>10</button>
		<br />
		<button on:click={() => onAutoSpin(20)}>20</button>
		<br />
		<button on:click={() => onAutoSpin(30)}>30</button>
		<br />
		<button on:click={() => onAutoSpin(50)}>50</button>
		<br />
		<button on:click={() => onAutoSpin(100)}>100</button>
		<div class="arrow variant-filled" />
	</div>
	<!-- auto spin button -->
	{#if autoSpinLeft == 0}
		<button
			use:popup={popupClick}
			type="button"
			class="btn btn-md variant-filled text-xs ml-5 mr-2"
		>
			AUTO
		</button>
		<!-- else stop auto spin -->
	{:else}
		<button
			on:click={() => onAutoSpin(0)}
			type="button"
			class="btn btn-md variant-filled-error text-xs ml-5 mr-2"
		>
			{autoSpinLeft}
			<br />
			STOP
		</button>
	{/if}

	<!-- spin button -->
	<button
		on:click={onSpin}
		disabled={!spinEnabled}
		type="button"
		class="btn-icon btn-icon-xl variant-filled-tertiary mr-auto"
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
