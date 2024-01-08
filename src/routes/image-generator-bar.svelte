<script lang="ts">
	let colorValue = '#ff0000';

    let inputText = '';

    let data = {};

    async function tryCreateNewTheme() {
        const theme = {
            name: inputText
        };

        const resp = await fetch('/api/slot/theme/create', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(theme)
        });

        data = await resp.json();

    }
</script>

<label class="label">
	<span>Input</span>
	<input bind:value={inputText} class="input" type="text" placeholder="Input" />
</label>
<button class="btn mt-3 variant-filled" on:click={tryCreateNewTheme}>Generate Images</button>

data = {JSON.stringify(data)}

<!-- <div class="grid grid-cols-[auto_1fr] gap-2">
        <input class="input" type="color" bind:value={colorValue} />
        <input class="input" type="text" bind:value={colorValue} readonly tabindex="-1" />
    </div> -->
