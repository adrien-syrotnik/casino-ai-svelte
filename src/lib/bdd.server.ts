import { env } from '$env/dynamic/private';
import { promises as fs } from 'fs';
import { sha256 } from 'js-sha256';
import type { BestWin as WinDetail, PlayerData } from './bdd-types';
import { addMessage } from './chat.server';

// Path: src/lib/bdd.server.ts
const save_file_path = 'src/lib/bdd.json';

export type BddData = {
    players: PlayerData[],
    bestWinsMultiplier: WinDetail[],
    bestWins: WinDetail[]
}

export class Bdd {
    private data: BddData;

    constructor() {
        this.data = {
            players: [],
            bestWinsMultiplier: [],
            bestWins: []
        };
    }

    public async load() {
        try {
            const data = await fs.readFile(save_file_path, 'utf8');
            this.data = JSON.parse(data);

            //Check if players exists
            if (!this.data.players) {
                this.data.players = [];
            }
            //Check if bestWinsMultiplier exists
            if (!this.data.bestWinsMultiplier) {
                this.data.bestWinsMultiplier = [];
            }
            //Check if bestWins exists
            if (!this.data.bestWins) {
                this.data.bestWins = [];
            }
        } catch (e) {
            console.error('Error while loading bdd, trying to recreate the file...');
            //If error, try to recreate the file
            this.data = {
                players: [],
                bestWinsMultiplier: [],
                bestWins: []
            };
            await this.save();
            //then rety to load
            await this.load();
        }
    }

    public async save() {
        try {
            await fs.writeFile(save_file_path, JSON.stringify(this.data), 'utf8');
        } catch (e) {
            console.error(e);
        }
    }

    public async addPlayer(player: PlayerData) {
        this.data.players.push(player);
        await this.save();
    }

    public async getPlayer(id: string): Promise<PlayerData | undefined> {
        return this.data.players.find(player => player.id === id);
    }

    public async getPlayerByName(name: string): Promise<PlayerData | undefined> {
        return this.data.players.find(player => player.name === name);
    }

    public async updatePlayer(player: PlayerData) {
        const index = this.data.players.findIndex(p => p.id === player.id);
        if (index === -1) {
            throw new Error('Player not found');
        }
        this.data.players[index] = player;
        await this.save();
    }

    public async deletePlayer(id: string) {
        this.data.players = this.data.players.filter(player => player.id !== id);
        await this.save();
    }

    public createId(username: string, password: string) {
		//Create the id from username and password, by creating a hash and using a salt from .env
        const id = username + password + env.SALT;
        console.log(env.SALT);
        console.log(id);
        //Sha256
        const id_sha256 = sha256(id);
        console.log(id_sha256);
        return id_sha256;
	}


    //Part best wins, only 5 best wins are saved
    private async addBestWinMultiplier(win: WinDetail) {
        //Check if win multiplier is better than the last one
        if (this.data.bestWinsMultiplier.length === 5 && this.data.bestWinsMultiplier[this.data.bestWinsMultiplier.length - 1].multiplier > win.multiplier) {
            return;
        }

        //Add an announcement in the chat
        addMessage({
            name: 'Announcement',
            timestamp: Date.now(),
            message: `🎉 New best win multiplier: ${win.username} won ${win.reward}€ with a bet of ${win.bet}€ and a multiplier of ${win.multiplier} 🎉`
        });

        //Add the win
        this.data.bestWinsMultiplier.push(win);
        //Sort the array
        this.data.bestWinsMultiplier.sort((a, b) => b.multiplier - a.multiplier);
        //Remove the last one if there is more than 5
        if (this.data.bestWinsMultiplier.length > 5) {
            this.data.bestWinsMultiplier.pop();
        }
        await this.save();
    }

    private async addBestWin(win: WinDetail) {
        //Check if win is better than the last one
        if (this.data.bestWins.length === 5 && this.data.bestWins[this.data.bestWins.length - 1].reward > win.reward) {
            return;
        }

        //Add an announcement in the chat
        addMessage({
            name: 'Announcement',
            timestamp: Date.now(),
            message: `🎉 New best win: ${win.username} won ${win.reward}€ with a bet of ${win.bet}€ and a multiplier of ${win.multiplier} 🎉`
        });

        //Add the win
        this.data.bestWins.push(win);
        //Sort the array
        this.data.bestWins.sort((a, b) => b.reward - a.reward);
        //Remove the last one if there is more than 5
        if (this.data.bestWins.length > 5) {
            this.data.bestWins.pop();
        }
        await this.save();
    }

    public async checkBestWin(win: WinDetail) {
        await this.addBestWin(win);
        await this.addBestWinMultiplier(win);
    }

    public async getBestWins() {
        return {
            bestWins: this.data.bestWins,
            bestWinsMultiplier: this.data.bestWinsMultiplier
        }
    }
}

//Create the bdd instance
export const bdd = new Bdd();
await bdd.load();