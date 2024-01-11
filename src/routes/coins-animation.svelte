<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	export let configCoin: any = {
		xRange: [-50, 50],
		yRange: [0, 0],
		xDirRange: [-20, 20],
		yDirRange: [-90, -120],
		spinSpeedRange: [30, 60],
		sizeSpeedRange: [-0.01, 0.01],
		gravityRange: [18, 22],
		delayRange: [0, 1500]
	};

	let x: number;
	let y: number;
	let dx: number;
	let dy: number;
	let gravity: number = 9.81;
	let spinSpeed: number = 30; //between 30 and 360
	let sizeSpeed: number = -0.04;

	let rotation: number = 0;
	let size: number = 1;

	let interval: any = null;

	onMount(() => {
		LaunchRandom(
			configCoin.xRange,
			configCoin.yRange,
			configCoin.xDirRange,
			configCoin.yDirRange,
			configCoin.spinSpeedRange,
			configCoin.sizeSpeedRange,
			configCoin.gravityRange,
			configCoin.delayRange
		);
		// Launch(innerWidth / 2, innerHeight/2, 0, -20, 30, -0.04, 9.81);
	});

	let isAlreadyDelaying = false;

	export async function LaunchRandom(
		xRange: [number, number] = [-50, 50],
		yRange: [number, number] = [0, 0],
		xDirRange: [number, number] = [-20, 20],
		yDirRange: [number, number] = [-90, -120],
		spinSpeedRange: [number, number] = [30, 60],
		sizeSpeedRange: [number, number] = [-0.01, 0.01],
		gravityRange: [number, number] = [20, 22],
		delayRange: [number, number] = [0, 300]
	) {
		if (!isAlreadyDelaying) {
			//Wait a random time before launching
			await new Promise((r) =>
				setTimeout(r, Math.floor(Math.random() * (delayRange[1] - delayRange[0])) + delayRange[0])
			);
			isAlreadyDelaying = true;
			show = true;
		}

		const startX =
			window.innerWidth / 2 + Math.floor(Math.random() * (xRange[1] - xRange[0])) + xRange[0];
		const startY =
			window.innerHeight + Math.floor(Math.random() * (yRange[1] - yRange[0])) + yRange[0];
		const xDir = Math.floor(Math.random() * (xDirRange[1] - xDirRange[0])) + xDirRange[0];
		const yDir = Math.floor(Math.random() * (yDirRange[1] - yDirRange[0])) + yDirRange[0];
		let spinSpeed =
			Math.floor(Math.random() * (spinSpeedRange[1] - spinSpeedRange[0])) + spinSpeedRange[0];
		if (Math.random() > 0.5) spinSpeed *= -1;
		const sizeSpeed = Math.random() * (sizeSpeedRange[1] - sizeSpeedRange[0]) + sizeSpeedRange[0];
		const gravity = Math.random() * (gravityRange[1] - gravityRange[0]) + gravityRange[0];

		Launch(startX, startY, xDir, yDir, spinSpeed, sizeSpeed, gravity);
	}

	export function Launch(
		xBaseD: number,
		yBaseD: number,
		xDirD: number,
		yDirD: number,
		spinSpeedD?: number,
		sizeSpeedD?: number,
		gravityD?: number
	) {
		stop();

		x = xBaseD;
		y = yBaseD;
		dx = xDirD;
		dy = yDirD;

		if (gravityD) gravity = gravityD;
		if (spinSpeedD) spinSpeed = spinSpeedD;
		if (sizeSpeedD) sizeSpeed = sizeSpeedD;
		interval = setInterval(update, 10);
	}

	function update() {
		x += dx * 0.1;
		y += dy * 0.1;
		dy += gravity * 0.1;

		rotation += spinSpeed * 0.1;
		size += sizeSpeed * 0.1;

		//If outside the screen, restart with random values
		if (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight + 100) {
			LaunchRandom(
				configCoin.xRange,
				configCoin.yRange,
				configCoin.xDirRange,
				configCoin.yDirRange,
				configCoin.spinSpeedRange,
				configCoin.sizeSpeedRange,
				configCoin.gravityRange,
				configCoin.delayRange
			);
			// Launch(innerWidth / 2, innerHeight/2, 0, -20, 30, -0.04, 9.81);
		}
	}

	function stop() {
		size = 1;
		rotation = 0;
		if (interval) clearInterval(interval);
	}

	onDestroy(() => {
		stop();
	});

	let show = false;
</script>

{#if show}
	<div
		class="coin"
		style="transform: translate({x - 50}px, {y -
			50}px) rotate({rotation}deg) scale({size}); width: 100px; height: 100px;"
	>
		<img src="coin.png" alt="" />
	</div>
{/if}

<style>
	.coin {
		position: fixed;
		z-index: 100;
	}
</style>
