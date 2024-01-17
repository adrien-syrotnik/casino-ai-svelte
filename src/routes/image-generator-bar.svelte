<script lang="ts">
	import { documentQuestionAnswering } from '@huggingface/inference';
	import SpinnerComponent from './spinner-component.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { ProgressBar, SlideToggle } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';

	onMount(() => {
		//Check if local storage has a theme prompt
		const themePrompt = localStorage.getItem('themePrompt');
		if (themePrompt) {
			inputText = themePrompt;
			isGenerating = true;
			refreshProgress();
		}

		start_time_date = localStorage.getItem('start_time_date')
			? new Date(localStorage.getItem('start_time_date')!)
			: new Date();
		openAPIKey = localStorage.getItem('openAPIKey') || '';
		useOpenAPI = localStorage.getItem('useOpenAPI') == 'true';
		useBetterPrompt = localStorage.getItem('useBetterPrompt') == 'true';
	});

	let colorValue = '#ff0000';

	let inputText = '';
	let openAPIKey = '';
	let useOpenAPI = false;

	let isGenerating = false;

	let data: any = {};
	let status: any = {};

	let themePromptUsed = '';

	let timeOutRefreshProgress: any = null;

	let start_time_date = new Date();
	let estimated_time_remaining = 0;
	let old_symbol = '';

	// status.currentStateImageGeneration.symbo

	async function refreshProgress() {
		const resp = await fetch('/api/slot/theme/status', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		const data = await resp.json();
		status = data.status;

		if (data.status != null) {
			estimated_time_remaining -= 1000;

			if (old_symbol != status.currentStateImageGeneration.symbol) {
				old_symbol = status.currentStateImageGeneration.symbol;

				const timePassed = new Date().getTime() - start_time_date.getTime();
				const average_time_per_step = timePassed / status.step;
				const remaining_steps = status.totalSteps - status.step;
				estimated_time_remaining = remaining_steps * average_time_per_step;
			}

			timeOutRefreshProgress = setTimeout(refreshProgress, 1000);
		} else {
			timeOutRefreshProgress = null;
			isGenerating = false;
			//remove local storage
			localStorage.removeItem('themePrompt');
			alert('Generation finished');
			localStorage.removeItem('timePassed');
		}
	}

	async function tryCreateNewTheme() {
		const theme = {
			themePrompt: inputText,
			precision: 25,
			useOpenAPI,
			openAPIKey,
			useBetterPrompt
		};

		//Set local storage
		localStorage.setItem('themePrompt', inputText);
		start_time_date = new Date();
		localStorage.setItem('start_time_date', start_time_date.toString());

		isGenerating = true;

		const resp = await fetch('/api/slot/theme/create', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(theme)
		});

		data = await resp.json();

		if (data.error) {
			alert(JSON.stringify(data.error));
			isGenerating = false;
			return;
		}

		refreshProgress();
	}

	let useBetterPrompt = false;
	let ToggleBetterPrompt = () => {
		useBetterPrompt = !useBetterPrompt;
		localStorage.setItem('useBetterPrompt', useBetterPrompt.toString());
	};

	let ToggleOpenAPI = () => {
		useOpenAPI = !useOpenAPI;
		localStorage.setItem('useOpenAPI', useOpenAPI.toString());
	};

	onDestroy(() => {
		if (timeOutRefreshProgress != null) {
			clearTimeout(timeOutRefreshProgress);
		}
	});
</script>

<label class="label mt-3">
	<span>Input</span>
	<input bind:value={inputText} class="input" type="text" placeholder="Input" />
</label>

<div class="flex mt-3" style="height: 50px;">
	<SlideToggle checked={useOpenAPI} on:change={ToggleOpenAPI} name="slider-label"
		>Use DallE</SlideToggle
	>

	<SlideToggle checked={useBetterPrompt} on:change={ToggleBetterPrompt} name="slider-label"
		>Better Prompt (use OpenAI)</SlideToggle
	>

	{#if useOpenAPI || useBetterPrompt}
		<label class="label flex" style="width: 80%;">
			<span>OpenAI API Key</span>
			<input
				bind:value={openAPIKey}
				class="input"
				type="password"
				placeholder="OpenAI API Key"
				on:change={() => localStorage.setItem('openAPIKey', openAPIKey)}
			/>
		</label>
	{:else}
		<div class="label flex" style="width: 80%;">
		</div>
	{/if}
</div>

<button
	disabled={isGenerating}
	class="btn mt-3 variant-filled text-center"
	on:click={tryCreateNewTheme}
>
	{#if isGenerating}
		<div class="flex justify-center items-center flex-col">
			Generating...
			<br />
			DO NOT LEAVE THIS PAGE
			<SpinnerComponent />
		</div>
	{:else}
		Generate Slot Sprites
	{/if}
</button>

{#if status && status.currentStateImageGeneration}
	<span>
		{status.step} / {status.totalSteps}
	</span>
	<span>
		<!-- From the time passed and the current step, we estimate that the generation will take for the rest of the steps -->
		{estimated_time_remaining / 1000} seconds left
	</span>

	<ProgressBar label="Progress Bar" value={status.step} max={status.totalSteps} />

	<span>
		Current symbol : {status.currentStateImageGeneration.symbol}
	</span>
	<span>
		{status.currentStateImageGeneration.status}
	</span>
{/if}

<!-- status = {JSON.stringify(status)} -->

<!-- <div class="grid grid-cols-[auto_1fr] gap-2">
        <input class="input" type="color" bind:value={colorValue} />
        <input class="input" type="text" bind:value={colorValue} readonly tabindex="-1" />
    </div> -->
