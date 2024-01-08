<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import SlotMachine from './slot-machine.svelte';
	import { AppBar } from '@skeletonlabs/skeleton';

	/** @type {import('./$types').PageData} */
	export let data:any;

	onMount(() => {});

	onDestroy(() => {});
</script>

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<!-- <div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">Let's get cracking bones!</h1>
		<p>Start by exploring:</p>
		<ul>
			<li><code class="code">/src/routes/+layout.svelte</code> - barebones layout</li>
			<li><code class="code">/src/app.postcss</code> - app wide css</li>
			<li>
				<code class="code">/src/routes/+page.svelte</code> - this page, you can replace the contents
			</li>
		</ul>
	</div>
</div> -->

<AppBar gridColumns="grid-cols-1" background={""} slotDefault="place-self-center">
		<img src="/logo2-bg.jpg" alt="logo" style="width: 150px; border-radius: 50%;" />
</AppBar>

<SlotMachine bind:data></SlotMachine>

<style>
</style>
