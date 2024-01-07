import fs from 'fs';
import type { SlotConfig, SlotSymbol } from './symbols.types';

export let currentConfig: SlotConfig = getConfig('default');

export function getAllConfigs(): string[] {
    //Check for the folders present in the config folder, path : 'slot-configs/'
    const dirs = fs.readdirSync('static/slot-configs/');
    console.log(dirs);

    //Check if all the folders have the required files (check only 10.png and colors.json)
    //If not, remove the folder from the list

    // WAIT FOR TEST TODO
    // for (const dir of dirs) {
    //     const files = fs.readdirSync(`static/slot-configs/${dir}`);
    //     if (!files.includes('10.png') || !files.includes('colors.json')) {
    //         dirs.splice(dirs.indexOf(dir), 1);
    //     }
    // }
    return dirs;
}

export function getConfig(name: string): SlotConfig {
    //Check if the config exists
    const colors = JSON.parse(fs.readFileSync(`static/slot-configs/${name}/colors.json`, 'utf8'));
    const config: SlotConfig = {
        _10: `slot-configs/${name}/10.png`,
        J: `slot-configs/${name}/J.png`,
        Q: `slot-configs/${name}/Q.png`,
        K: `slot-configs/${name}/K.png`,
        A: `slot-configs/${name}/A.png`,
        m1: `slot-configs/${name}/m1.png`,
        m2: `slot-configs/${name}/m2.png`,
        m3: `slot-configs/${name}/m3.png`,
        m4: `slot-configs/${name}/m4.png`,
        wild: `slot-configs/${name}/wild.png`,
        background: `slot-configs/${name}/background.png`,
        colors,
        name
    };
    return config;
}



export const DEFAULT_SYMBOLS: SlotSymbol[] = [
    { name: '10', reward: 80, image: currentConfig._10 },
    { name: 'J', reward: 80, image: currentConfig.J },
    { name: 'Q', reward: 100, image: currentConfig.Q },
    { name: 'K', reward: 100, image: currentConfig.K },
    { name: 'A', reward: 120, image: currentConfig.A },
    { name: 'm1', reward: 200, image: currentConfig.m1 },
    { name: 'm2', reward: 220, image: currentConfig.m2 },
    { name: 'm3', reward: 260, image: currentConfig.m3 },
    { name: 'm4', reward: 300, image: currentConfig.m4 },
    { name: 'wild', reward: 400, image: currentConfig.wild },
    // { name: 'bonus', reward: 700 }
];

export function getRandSymbol(symbols: SlotSymbol[] = DEFAULT_SYMBOLS): SlotSymbol {
    //Get random symbol from reward, more reward = less chance
    //Calcul weight based on reward
    const totalWeight = symbols.reduce((acc, symbol) => acc + symbol.reward, 0);
    const rand = Math.random() * totalWeight;
    //Get random symbol
    let acc = 0;
    for (const symbol of symbols) {
        acc += symbol.reward;
        if (acc >= rand) {
            return symbol;
        }
    }
    return symbols[0];

}


const lines25Matrix = [
    [0, 0, 0, 0, 0], // 1
    [1, 1, 1, 1, 1], // 2
    [2, 2, 2, 2, 2], // 3
    [0, 1, 2, 1, 0], // 4
    [2, 1, 0, 1, 2], // 5
    [1, 0, 0, 0, 1], // 6
    [1, 2, 2, 2, 1], // 7
    [0, 0, 1, 2, 2], // 8
    [2, 2, 1, 0, 0], // 9
    [1, 2, 1, 0, 1], // 10
    [1, 0, 1, 2, 1], // 11
    [0, 1, 1, 1, 0], // 12
    [2, 1, 1, 1, 2], // 13
    [0, 1, 0, 1, 0], // 14
    [2, 1, 2, 1, 2], // 15
    [1, 1, 0, 1, 1], // 16
    [1, 1, 2, 1, 1], // 17
    [0, 0, 2, 0, 0], // 18
    [2, 2, 0, 2, 2], // 19
    [0, 2, 2, 2, 0], // 20
    [2, 0, 0, 0, 2], // 21
    [1, 2, 0, 2, 1], // 22
    [1, 0, 2, 0, 1], // 23
    [0, 2, 0, 2, 0], // 24
    [2, 0, 2, 0, 2], // 25
];

export function checkLines25(reel1: string[], reel2: string[], reel3: string[], reel4: string[], reel5: string[]): {
    lines: {
        reelAndRow: number[][],
        reward: number,
        symbol: string,
        numberOfSymbol: number
    }[],
    reward: number
} {
    const lines = [];
    let reward = 0;
    const reelMatrix = [reel1, reel2, reel3, reel4, reel5];

    for (const line of lines25Matrix) {
        const symbols = line.map((row, reel) => reelMatrix[reel][row]);
        let symbol = symbols[0];

        // if (symbols.every(s => s === symbol)) {
        //     lines.push({
        //         reelAndRow: line.map((row, reel) => [reel, row]),
        //         reward: DEFAULT_SYMBOLS.find(s => s.name === symbol)!.reward
        //     });
        //     reward += lines[lines.length - 1].reward;

        //     continue;
        // }

        //If 5 symbols are the same OR with wild, give 100% of the reward, the reward need to be other than a wild
        if (symbols.slice(0, 5).every(s => {
            if (symbol === 'wild' && s !== 'wild') {
                symbol = s;
            }
            return (s === symbol || s === 'wild')
        })) {
            lines.push({
                reelAndRow: line.slice(0, 5).map((row, reel) => [reel, row]),
                reward: DEFAULT_SYMBOLS.find(s => s.name === symbol)!.reward,
                symbol,
                numberOfSymbol: 5
            });
            reward += lines[lines.length - 1].reward;

            continue;
        }


        //If 4 symbols in a row are the same, give 60% of the reward
        if (symbols.slice(0, 4).every(s => {
            if (symbol === 'wild' && s !== 'wild') {
                symbol = s;
            }
            return (s === symbol || s === 'wild')
        })) {
            lines.push({
                reelAndRow: line.slice(0, 4).map((row, reel) => [reel, row]),
                reward: DEFAULT_SYMBOLS.find(s => s.name === symbol)!.reward * 0.6,
                symbol,
                numberOfSymbol: 4
            });
            reward += lines[lines.length - 1].reward;

            continue;
        }

        //If 3 symbols in a row are the same, give 30% of the reward
        if (symbols.slice(0, 3).every(s => {
            if (symbol === 'wild' && s !== 'wild') {
                symbol = s;
            }
            return (s === symbol || s === 'wild')
        })) {
            lines.push({
                reelAndRow: line.slice(0, 3).map((row, reel) => [reel, row]),
                reward: DEFAULT_SYMBOLS.find(s => s.name === symbol)!.reward * 0.3,
                symbol,
                numberOfSymbol: 3
            });
            reward += lines[lines.length - 1].reward;
        }


    }

    //Order lines by reward
    lines.sort((a, b) => b.reward - a.reward);

    return { lines, reward };
}

