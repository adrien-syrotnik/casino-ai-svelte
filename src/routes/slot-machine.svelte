<script lang="ts">
	import SlotReel from "./slot-reel.svelte";
	import { DEFAULT_SYMBOLS, checkLines25, getRandSymbol } from "$lib/symbols";
	import { onMount } from "svelte";
	let symbol = DEFAULT_SYMBOLS[0];
	let Slotreel = [null, null, null, null, null] as any;

	onMount(() => {
		
	});

	function SpinReels(reel : number) {
		Slotreel[reel].spinAllSymbols();
	}

	let reward = 0;

	let sold = 6000;
	let price = 200;

	let spinEnabled = true;

	function SpinAllDelay(delayBetween : number = 100) {
		if(sold < price) {
			return;
		}

		sold -= price;

		SpinReels(0);
		setTimeout(() => {
			SpinReels(1);
		}, delayBetween);
		setTimeout(() => {
			SpinReels(2);
		}, delayBetween * 2);
		setTimeout(() => {
			SpinReels(3);
		}, delayBetween * 3);
		setTimeout(() => {
			SpinReels(4);
		}, delayBetween * 4);

		spinEnabled = false;


		setTimeout(() => {
			const symbolReel = Slotreel.map((r:any) => r.currentSymbols) as [string[], string[], string[], string[], string[]];
			let result = checkLines25(...symbolReel);
			console.log(result);
			
			reward = result.reward;
			sold += result.reward;

			if(result.lines.length > 0) {
				result.lines.forEach((line) => {
					line.reelAndRow.forEach((pos) => {
						const reel = pos[0]
						const row = pos[1]
						//Add class win to the .symbol div
						Slotreel[reel].currentSymbolsNode[row].$$.ctx[2].classList.add("win");
					});
				});
			}

			spinEnabled = true;
		}, 2000);
	}

</script>




<div class="container justify-center mx-auto flex flex-col text-center" style="margin-top: 200px;">
	<div class="slot-machine justify-center">
		<div class="reel">
			<SlotReel bind:this={Slotreel[0]} />
		</div>
		<div class="reel">
			<SlotReel bind:this={Slotreel[1]} />
		</div>
		<div class="reel">
			<SlotReel bind:this={Slotreel[2]} />
		</div>
		<div class="reel">
			<SlotReel bind:this={Slotreel[3]} />
		</div>
		<div class="reel">
			<SlotReel bind:this={Slotreel[4]} />
		</div>
	</div>
	Récompense : {reward}€
	<p>Solde {sold}€</p>
	<div>
		<button disabled='{!spinEnabled}' on:click={() => SpinAllDelay()} type="button" class="btn btn-md variant-filled">Spin</button> 200€
	</div>
</div>

<style>
	.slot-machine {
		display: flex;
		overflow: hidden;
	}

	.reel {
		width: 100px;
		height: 304px;
		border: 2px solid #333;
		margin: 0 5px;
		background-color: #000;
		overflow: hidden;
	}

	:global(.symbols) {
		display: flex;
		flex-direction: column;
	}

	:global(.symbol) {
		width: 100%;
		height: 100px;
		/* margin-bottom: 5px; */
		/* box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); */
	}

</style>
