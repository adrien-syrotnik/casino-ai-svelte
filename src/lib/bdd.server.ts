import { env } from '$env/dynamic/private';
import { promises as fs } from 'fs';
import { sha256 } from 'js-sha256';

// Path: src/lib/bdd.server.ts
const save_file_path = 'src/lib/bdd.json';

export type PlayerData = {
    name: string,
    id: string,
    balance: number,
    created_at: string
}

export type BddData = {
    players: PlayerData[]
}

export class Bdd {
    private data: BddData;

    constructor() {
        this.data = {
            players: []
        };
    }

    public async load() {
        try {
            const data = await fs.readFile(save_file_path, 'utf8');
            this.data = JSON.parse(data);
        } catch (e) {
            console.error(e);
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
}

//Create the bdd instance
export const bdd = new Bdd();
await bdd.load();