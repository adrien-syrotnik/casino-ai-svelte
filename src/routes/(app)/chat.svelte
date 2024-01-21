<script lang="ts">
	// Components
	import { Avatar } from '@skeletonlabs/skeleton';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { player } from '$lib/player-store';

	// Types
	interface MessageFeed {
		host: boolean;
		name: string;
		timestamp: number;
		message: string;
	}

	let elemChat: HTMLElement;

	// Messages
	let messageFeed: MessageFeed[] = [];
	let currentMessage = '';

	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	async function addMessage() {
		if (!currentMessage) return;

		const newMessage = {
			host: true,
			name: $player.name,
			timestamp: new Date().getTime(),
			message: currentMessage
		};

		console.log(newMessage);

		await sendNewMessage(newMessage);

		// Update the message feed
		messageFeed = [...messageFeed, newMessage];
		// Clear prompt
		currentMessage = '';
		// Smooth scroll to bottom
		// Timeout prevents race condition
		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 0);
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
	}

	const dispatch = createEventDispatcher();

	const onClose = () => {
		dispatch('close');
	};

	async function sendNewMessage(message: MessageFeed) {
		lastTimestamp = message.timestamp;

		fetch('/api/chat/new-message', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ message })
		})
			.then((res) => res.json())
			.then((data) => {
				
			});
	}

	let intervalRefreshMessages: NodeJS.Timeout;

	let lastTimestamp: number = new Date().getTime();

	// When DOM mounted, scroll to bottom
	onMount(() => {
		intervalRefreshMessages = setInterval(() => {
			//Try to get messages from server, put date in body
			fetch('/api/chat/refresh-chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ lastTimestamp })
			})
				.then((res) => res.json())
				.then((data) => {
					data = data.messages;
					// console.log(data);
					for (let i = 0; i < data.length; i++) {
						if (data[i].timestamp <= lastTimestamp) continue;
						const newMessage = {
							host: false,
							name: data[i].name,
							timestamp: data[i].timestamp,
							message: data[i].message
						};
						messageFeed = [...messageFeed, newMessage];
						lastTimestamp = data[i].timestamp;
					}
					// scrollChatBottom();
				});
		}, 5000);
	});

	onDestroy(() => {
		clearInterval(intervalRefreshMessages);
	});
</script>

<!-- Slot: Sandbox -->
<div style="width: 700px;">
	<section class="card">
		<div class="chat w-full h-full">
			<!-- Close button -->
			<div class="flex justify-end">
				<button class="btn m-2 btn-icon variant-filled-primary" on:click={onClose}>X</button>
			</div>

			<!-- Chat -->
			<div class="w-full">
				{#if messageFeed && messageFeed.length > 0}
					<!-- Conversation -->
					<section bind:this={elemChat} class="max-h-[500px] p-4 overflow-y-auto space-y-4">
						{#each messageFeed as bubble}
							{#if bubble.host === true}
								<div class="grid grid-cols-[auto_1fr] gap-2">
									<Avatar initials={bubble.name.charAt(0)} width="w-12" />
									<div class="card p-4 variant-soft rounded-tl-none space-y-2">
										<header class="flex justify-between items-center">
											<p class="font-bold">{bubble.name}</p>
											<small class="opacity-50">{bubble.timestamp}</small>
										</header>
										<p>{bubble.message}</p>
									</div>
								</div>
							{:else}
								<div class="grid grid-cols-[1fr_auto] gap-2">
									<div class="card p-4 rounded-tr-none space-y-2 variant-soft-primary">
										<header class="flex justify-between items-center">
											<p class="font-bold">{bubble.name}</p>
											<small class="opacity-50">{bubble.timestamp}</small>
										</header>
										<p>{bubble.message}</p>
									</div>
									<Avatar initials={bubble.name.charAt(0)} width="w-12" />
								</div>
							{/if}
						{/each}
					</section>
				{/if}
				<!-- Prompt -->
				<section class="border-t border-surface-500/30 p-4">
					<div
						class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
					>
						<button class="input-group-shim">+</button>
						<textarea
							bind:value={currentMessage}
							class="bg-transparent border-0 ring-0"
							name="prompt"
							id="prompt"
							placeholder="Write a message..."
							rows="1"
							on:keydown={onPromptKeydown}
						/>
						<button
							class={currentMessage ? 'variant-filled-primary' : 'input-group-shim'}
							on:click={addMessage}
						>
							<i class="fa-solid fa-paper-plane" />
						</button>
					</div>
				</section>
			</div>
		</div>
	</section>
</div>
