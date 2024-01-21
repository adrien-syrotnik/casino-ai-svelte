<script lang="ts">
	import '../../app.postcss';

	// Highlight JS
	import hljs from 'highlight.js/lib/core';
	import 'highlight.js/styles/github-dark.css';
	import {
		storeHighlightJs,
		type ModalComponent,
		AppBar,
		type PopupSettings,
		popup
	} from '@skeletonlabs/skeleton';
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';

	hljs.registerLanguage('xml', xml); // for HTML
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('typescript', typescript);
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { Modal, initializeStores } from '@skeletonlabs/skeleton';
	import RewardsModal from './rewards-modal.svelte';
	import AnimationWin from './animation-win.svelte';
	import { player } from '$lib/player-store';

	initializeStores();

	const modalRegistry: Record<string, ModalComponent> = {
		rewardsModal: { ref: RewardsModal }
	};

	const logout = async () => {
		const logoutRequest = await fetch('/api/logout', { method: 'POST' });
		if (logoutRequest.ok) {
			window.location.href = '/login';
		}
	};

	const resetBalance = async () => {
		const resetBalanceRequest = await fetch('/api/reset-balance', { method: 'POST' });
		if (resetBalanceRequest.ok) {
			const data = await resetBalanceRequest.json();
			player.set({ ...$player, balance: data.newBalance });
		}
	};

	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'right'
	};
</script>

<div class="card p-4 variant-filled-secondary" data-popup="popupHover">
	<p>Profile created at: {new Date(parseInt($player.created_at)).toLocaleString()}</p>
	<div class="arrow variant-filled-secondary" />
</div>

<div class="flex flex-col justify-center items-center my-5">
	<h3 class="h3 mb-2">Welcome <u use:popup={popupHover}>{$player.name}</u></h3>

	<div class="flex space-x-3">
		<!-- Logout -->
		<button class="btn variant-filled-primary" on:click={logout}>Logout</button>
		<!-- Reset Balance -->
		<button class="btn variant-filled-warning" on:click={resetBalance}>Reset Balance<small>(1000€)</small></button>
	</div>
</div>

<AnimationWin></AnimationWin>

<Modal components={modalRegistry} />

<slot />

<style>
	/* background image fixed */
	:global(body) {
		background-image: url('/logo2-bg.jpg');
		background-repeat: no-repeat;
		background-attachment: fixed;
		background-size: cover;
	}
</style>
