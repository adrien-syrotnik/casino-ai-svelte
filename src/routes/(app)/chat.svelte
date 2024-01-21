<script lang="ts">
	// Components
	import { Avatar } from '@skeletonlabs/skeleton';
	import { createEventDispatcher, onMount } from 'svelte';
	import { io, Socket } from 'socket.io-client';
	import { player } from '$lib/player-store';

	const socket = io();

	socket.on('message', (message) => {
		//Add message to messageFeed
		const newMessage = {
			host: false,
			name: message.name,
			timestamp: message.timestamp,
			message: message.message
		};

		messageFeed = [...messageFeed, newMessage];
	});

	// Types
	interface MessageFeed {
		host: boolean;
		name: string;
		timestamp: string;
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

	function getCurrentTimestamp(): string {
		return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	}

	function addMessage(): void {
		if (!currentMessage) return;

		const newMessage = {
			host: true,
			name: $player.name,
			timestamp: `Today @ ${getCurrentTimestamp()}`,
			message: currentMessage
		};

		socket.emit('message', newMessage);

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

	// When DOM mounted, scroll to bottom
	onMount(() => {
		// scrollChatBottom();
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
