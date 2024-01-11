<script lang="ts">
	import { triggerClose, triggerWin } from '$lib/win-modal-store';
	import { onDestroy, onMount } from 'svelte';
	import { cubicInOut, cubicOut, quintOut } from 'svelte/easing';
	import { tweened, type Unsubscriber } from 'svelte/motion';
	import { scale } from 'svelte/transition';

	let audioBIGWIN: HTMLAudioElement;
	let audioMEGAWIN: HTMLAudioElement;
	let audioHUGEWIN: HTMLAudioElement;
	let audioULTRAWIN: HTMLAudioElement;
	let audioJACKPOT: HTMLAudioElement;
	let audioMONSTERWIN: HTMLAudioElement;
	let audioIMPOSSIBLE: HTMLAudioElement;

	let unsubscribeTriggerWin: Unsubscriber;

	onMount(() => {
		unsubscribeTriggerWin = triggerWin.subscribe(async (win) => {
			if (win.win > 0) {
				rewardTime.set(0, { duration: 0 });
				sizeTime.set(100, { duration: 0 });
				bet = win.bet;
				StartAnimation(win.win);
			}
		});

		stepAvailabe = [
			{
				name: 'BIG WIN!',
				start: 0,
				image: 'images/big-win.png',
				font_color: '#FFD700',
				size_start: 100,
				size_end: 120,
				song: audioBIGWIN
			},
			{
				name: 'MEGA WIN!',
				start: 20,
				image: 'images/mega-win.png',
				font_color: ' #FFA500',
				size_start: 110,
				size_end: 130,
				song: audioMEGAWIN
			},
			{
				name: 'HUGE WIN!',
				start: 50,
				image: 'images/mega-win.png',
				font_color: '#FF0000',
				size_start: 120,
				size_end: 140,
				song: audioHUGEWIN
			},
			{
				name: 'ULTRA WIN!',
				start: 100,
				image: 'images/super-win.png',
				font_color: '(#800080',
				size_start: 130,
				size_end: 150,
				song: audioULTRAWIN
			},
			{
				name: 'JACKPOT!',
				start: 300,
				image: 'images/ultra-win.png',
				font_color: '#DAA520',
				size_start: 140,
				size_end: 160,
				song: audioJACKPOT,
				volume: 1
			},
			{
				name: 'MONSTER WIN!',
				start: 500,
				image: 'images/jackpot.png',
				font_color: '#008000',
				size_start: 150,
				size_end: 170,
				song: audioMONSTERWIN,
				volume: 1,
				playbackRate: 1.5
			},
			{
				name: 'IMPOSSIBLE!!!',
				start: 1000,
				image: 'images/jackpot.png',
				font_color: '#00FFFF',
				size_start: 160,
				size_end: 180,
				song: audioIMPOSSIBLE,
				volume: 1,
				playbackRate: 2
			}
		];
	});

	let rewardTime = tweened(0, {
		duration: 5000,
		easing: cubicOut
	});

	let sizeTime = tweened(100, {
		duration: 5000,
		easing: cubicOut
	});

	let sizeTextTransition = tweened(50, {
		duration: 200,
		easing: cubicInOut
	});

	let currentWinPrice = 0;

	let color = 'white';
	let winText = 'WIN';

	let bet = 2;

	let stepAvailabe: {
		name: string;
		start: number;
		image: string;
		font_color: string;
		size_start: number;
		size_end: number;
		song: HTMLAudioElement;
		volume?: number;
		playbackRate?: number;
	}[];

	async function StartAnimation(win: number) {
		//Use the first element of the array, then play animation until next reward step, if not reach, then play until win is reach
		let stepIndex = 0;
		let step = stepAvailabe[stepIndex];

		currentWinPrice = win;

		show = true;

		for (let i = 0; i < stepAvailabe.length; i++) {
			if (stepIndex == stepAvailabe.length - 1) {
				await PlayAnimation(step, 1, win);
				nextSpinFunction = null;
				break;
			}

			let diffWithNextStep = currentWinPrice - stepAvailabe[stepIndex + 1].start;

			if (diffWithNextStep <= 0) {
				//If the diff is negative, then get the pourcentage of animation to play
				let pourcentage = 1 - diffWithNextStep / (stepAvailabe[stepIndex + 1].start - step.start);
				await PlayAnimation(step, pourcentage, win);
				nextSpinFunction = null;
				break;
			}

			await PlayAnimation(step, 1, stepAvailabe[stepIndex + 1].start);
			stepIndex++;
			step = stepAvailabe[stepIndex];
			nextSpinFunction = null;
		}

		//FInalyse by increasing the size a little bit
		sizeTime.set(step.size_end + 20, { duration: 200, easing: cubicInOut });
		let timeout1 = setTimeout(() => {
			sizeTime.set(step.size_end + 30, { duration: 2800, easing: (t) => t });
		}, 200);

		let timeout2 = setTimeout(() => {
			show = false;
			//Stop sound
			stepAvailabe.forEach((s) => {
				s.song.pause();
				s.song.currentTime = 0;
			});
			triggerClose.set(1);
		}, 3000);

		nextSpinFunction = () => {
			clearTimeout(timeout1);
			clearTimeout(timeout2);
			sizeTime.set(step.size_end + 30, { duration: 0 });
			setTimeout(() => {
				show = false;
				//Stop sound
				stepAvailabe.forEach((s) => {
					s.song.pause();
					s.song.currentTime = 0;
				});
				triggerClose.set(1);
			}, 200);
		};
	}

	let show = false;

	async function PlayAnimation(
		step: {
			name: string;
			start: number;
			image: string;
			font_color: string;
			size_start: number;
			size_end: number;
			song: HTMLAudioElement;
			volume?: number;
			playbackRate?: number;
		},
		pourcentage: number = 1,
		finalPrice: number
	) {
		return new Promise((resolve) => {
			color = step.font_color;
			winText = step.name;
			rewardTime.set(finalPrice);

			sizeTextTransition.set(40, { duration: 0, easing: cubicInOut });
			sizeTextTransition.set(50, { duration: 200, easing: cubicInOut });

			//Play sound and cancel previous sound if exist
			if (step.song.volume) {
				step.song.volume = step.song.volume;
				step.song.playbackRate = step.song.playbackRate;
			} else {
				step.song.volume = 1;
				step.song.playbackRate = 1;
			}
			step.song.play();
			stepAvailabe.forEach((s) => {
				if (s.song != step.song) {
					s.song.pause();
					s.song.currentTime = 0;
				}
			});

			sizeTime.set(step.size_start + (step.size_end - step.size_start) * pourcentage);
			let nextSpinTimeOut = setTimeout(() => {
				resolve(0);
			}, 5000);

			nextSpinFunction = () => {
				clearTimeout(nextSpinTimeOut);
				//Set size and price instant
				sizeTime.set(step.size_end, { duration: 0 });
				rewardTime.set(finalPrice, { duration: 0 });
				sizeTextTransition.set(40, { duration: 0 });

				resolve(0);
			};
		});
	}

	let nextSpinFunction: any;

	onDestroy(() => {
		if(unsubscribeTriggerWin)
			unsubscribeTriggerWin();
	});
</script>

<audio src="musics/1.wav" bind:this={audioBIGWIN}></audio>
<audio src="musics/2.wav" bind:this={audioMEGAWIN}></audio>
<audio src="musics/3.wav" bind:this={audioHUGEWIN}></audio>
<audio src="musics/4.wav" bind:this={audioULTRAWIN}></audio>
<audio src="musics/end.mp3" bind:this={audioJACKPOT}></audio>
<audio src="musics/end.mp3" bind:this={audioMONSTERWIN}></audio>
<audio src="musics/end.mp3" bind:this={audioIMPOSSIBLE}></audio>

{#if show}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		id="modal-reward"
		class="flex flex-col justify-center items-center"
		transition:scale={{ duration: 500, easing: quintOut }}
		on:click={() => nextSpinFunction?.()}
	>
		<div
			class="number-win"
			style="font-size: {$sizeTime +
				$sizeTextTransition}px; color: {color}; opacity: 1; height: {$sizeTime +
				$sizeTextTransition}px; font-family: 'CasinoFlatShadow-Italic';"
		>
			{winText}
		</div>
		<div class="number-win" style="font-size: {$sizeTime}px; color: {color}; opacity: 1;">
			<!-- {Math.round($rewardTime * 100) / 100} € -->
			{($rewardTime * bet).toFixed(2)}<span style="font-family: 'Graduate-9WoB';">€</span>
		</div>
	</div>
{/if}

<style>
	@font-face {
		font-family: 'CoffeetinInitials';
		src: url('fonts/CoffeetinInitials-YXJ2.ttf');
	}

	@font-face {
		font-family: 'CasinoFlatShadow-Italic';
		src: url('fonts/CasinoFlatShadow-Italic.ttf');
	}

	@font-face {
		font-family: 'Casino3D-Italic';
		src: url('fonts/Casino3D-Italic.ttf');
	}

	@font-face {
		font-family: 'SuperstarM54-Zq6K';
		src: url('fonts/SuperstarM54-Zq6K.ttf');
	}

	@font-face {
		font-family: 'Graduate-9WoB';
		src: url('fonts/new/Graduate-9WoB.ttf');
	}

	#modal-reward {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 100;

		position: fixed;
		top: 50%;
		left: 50%;
		/* bring your own prefixes */
		transform: translate(-50%, -50%);

        overflow: visible;
	}

	.number-win {
		font-family: 'SuperstarM54-Zq6K';
	}
</style>
