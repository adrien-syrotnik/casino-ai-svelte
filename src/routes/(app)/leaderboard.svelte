<script lang="ts">
	import type { BestWin } from '$lib/bdd-types';

	export let bestScores: {
		bestWins: BestWin[];
		bestWinsMultiplier: BestWin[];
	};

	const rowToshow = 5;
</script>

<div class="flex flex-col justify-center items-center">
	<div
		class="
        w-full
        flex
        justify-center
        items-center
        space-x-5
        text-center
        text-white
        text-2xl
        mb-5"
	>
		<div class="w-1/3 card variant-ghost-success p-5">
			<div class="text-3xl font-bold mb-2">Best wins</div>
			<div class="flex flex-col space-y-2">
				{#each Array(rowToshow) as _, i}
					{#if bestScores && bestScores.bestWins[i]}
						<div class="flex flex-col variant-ghost-success card p-2">
							<div>{bestScores.bestWins[i].username} ({bestScores.bestWins[i].bet.toFixed(2)}€)</div>
							<div style="color: gold; font-weight: 800;">{bestScores.bestWins[i].reward.toFixed(2)}€</div>
						</div>
					{:else}
						<div>-</div>
					{/if}
				{/each}
			</div>
		</div>
		<div class="w-1/3 card variant-ghost-success p-5">
			<div class="text-3xl font-bold mb-2">Best wins multiplier</div>
			<div class="flex flex-col space-y-2">
				{#each Array(rowToshow) as _, i}
					{#if bestScores && bestScores.bestWinsMultiplier[i]}
						<div class="flex justify-between variant-ghost-success card p-2">
							<div>
								{bestScores.bestWinsMultiplier[i].username} ({bestScores.bestWinsMultiplier[i]
									.bet.toFixed(2)}€)
							</div>
							<div style="color: gold; font-weight: 800;">{bestScores.bestWinsMultiplier[i].multiplier.toFixed(2)}x</div>
						</div>
					{:else}
						<div>-</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
