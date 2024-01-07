export type SlotSymbol = {
    name: string;
    reward: number;
    image?: string;
};

import _10 from '$lib/assets/10.png';
import J from '$lib/assets/J.png';
import Q from '$lib/assets/Q.png';
import K from '$lib/assets/K.png';
import A from '$lib/assets/A.png';
import m1 from '$lib/assets/m1.png';
import m2 from '$lib/assets/m2.png';
import m3 from '$lib/assets/m3.png';
import m4 from '$lib/assets/m4.png';
import wild from '$lib/assets/wild.png';

export const DEFAULT_SYMBOLS: SlotSymbol[] = [
    { name: '10', reward: 80, image: _10 },
    { name: 'J', reward: 80, image: J },
    { name: 'Q', reward: 100, image: Q },
    { name: 'K', reward: 100, image: K },
    { name: 'A', reward: 120, image: A },
    { name: 'm1', reward: 200, image: m1 },
    { name: 'm2', reward: 220, image: m2 },
    { name: 'm3', reward: 260, image: m3 },
    { name: 'm4', reward: 300, image: m4 },
    { name: 'wild', reward: 400, image: wild }
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
        symbol: string
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
                symbol
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
                symbol
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
                symbol
            });
            reward += lines[lines.length - 1].reward;
        }


    }
    return { lines, reward };
}