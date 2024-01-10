import { writable } from 'svelte/store';

export const triggerWin = writable({win:0, bet:0});
export const triggerClose = writable();