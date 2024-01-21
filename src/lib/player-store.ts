import { writable } from 'svelte/store';
import type { PlayerData } from './bdd-types';

export const player = writable<PlayerData>({ name: '', id: '', balance: 0, created_at: '' });


export function updatePlayerBalance(balance: number) {
    player.update((p) => {
        return {
            ...p,
            balance
        }
    });
}