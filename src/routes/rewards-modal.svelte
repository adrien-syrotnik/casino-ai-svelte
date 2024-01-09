<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import { getModalStore } from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	// Base Classes
	const cBase = 'relative w-modal-wide shadow-xl';
	const cButton = 'absolute -top-3 -right-3 z-1 btn-icon variant-filled';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<button class={cButton} on:click={parent.onClose}>✕</button>
		<div class="flex flex-col">
			<div class="table-container">
				<!-- Native Table Element -->
				<table class="table table-hover">
					<thead>
						<tr style="text-align: center;">
							<th style="font-size: 20px;"><b>Symbol</b></th>
							<th style="font-size: 20px;"><b>x3</b></th>
							<th style="font-size: 20px;"><b>x4</b></th>
							<th style="font-size: 20px;"><b>x5</b></th>
						</tr>
					</thead>
					<tbody>
						{#each $modalStore[0].meta?.SYMBOLS as symbol, i}
							<tr style="text-align: center;">
								<td class="flex justify-center"
									><img style="width: 200px; height: 200px;" src={symbol.image} alt="" /></td
								>
								<td style="font-size: 40px; vertical-align: middle;">{symbol.reward * 0.3}€</td>
								<td style="font-size: 40px; vertical-align: middle;">{symbol.reward * 0.6}€</td>
								<td style="font-size: 40px; vertical-align: middle;">{symbol.reward}€</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}
