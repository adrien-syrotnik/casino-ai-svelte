import { writable, type Writable } from 'svelte/store';
import type { PlayerData } from './bdd-types';
import { localStorageStore } from '@skeletonlabs/skeleton';

export const player = writable<PlayerData>({ name: '', id: '', balance: 0, created_at: '' });


export function updatePlayerBalance(balance: number) {
    player.update((p) => {
        return {
            ...p,
            balance
        }
    });
}

export const currentMusicConfig: Writable<string> = localStorageStore('currentMusicConfig', 'Suno');

export const SunoConfig = {
    '1' : 'musics/1.wav',
    '2' : 'musics/2.wav',
    '3' : 'musics/3.wav',
    '4' : 'musics/4.wav',
    '5' : 'musics/end.mp3',
    '6' : 'musics/end.mp3',
    '7' : 'musics/end.mp3',
    '8' : 'musics/end.mp3',
    '9' : 'musics/indestructible/9.wav'
}

export const IndestructibleConfig = {
    '1' : 'musics/indestructible/1.wav',
    '2' : 'musics/indestructible/2.wav',
    '3' : 'musics/indestructible/3.wav',
    '4' : 'musics/indestructible/4.wav',
    '5' : 'musics/indestructible/5.wav',
    '6' : 'musics/indestructible/6.wav',
    '7' : 'musics/indestructible/7.wav',
    '8' : 'musics/indestructible/8.wav',
    '9' : 'musics/indestructible/9.wav',
}