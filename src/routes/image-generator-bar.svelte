<script lang="ts">
    let colorValue = "#ff0000";

</script>


<form method="POST">
    <label class="label">
        <span>Input</span>
        <input class="input" type="text" placeholder="Input" />
    </label>
    <button type="submit" class="btn">Generate Images</button>

    <!-- <div class="grid grid-cols-[auto_1fr] gap-2">
        <input class="input" type="color" bind:value={colorValue} />
        <input class="input" type="text" bind:value={colorValue} readonly tabindex="-1" />
    </div> -->

</form>


