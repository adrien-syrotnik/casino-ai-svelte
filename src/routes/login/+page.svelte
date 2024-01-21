<script lang="ts">
	import { goto } from "$app/navigation";


    let username = '';
    let password = '';

    const login = async () => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json();
            //If redirectPath is set, redirect to that path
            if (data.redirectPath) {
                goto(data.redirectPath);
            }
        }
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key == 'Enter') {
            login();
        }
    }
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="container mx-auto h-full flex justify-center items-center">
	<div
		class="previewer-preview flex justify-center items-center mx-auto transition-[width] duration-200 w-6/12"
	>
		<div class="card p-10 w-full text-token space-y-4">
			<h1 class="h1 text-center">Please login</h1>

			<label class="label"
				><span>Username</span> <input bind:value={username} class="input" type="text" placeholder="Username" /></label
			>
			<label class="label"
				><span>Password</span>
				<input class="input" bind:value={password} type="password" placeholder="Password" /></label
			>

            <div class="flex justify-center">
                <button on:click={login} class="btn variant-filled">Login</button>
            </div>
		</div>
	</div>
</div>

<style>
	.container {
		height: 100vh;
	}
</style>
