import fs from 'fs';
import type { SlotConfig, SlotSymbol } from './symbols.types';

export function getAllConfigs(): string[] {
    //Check for the folders present in the config folder, path : 'slot-configs/'
    const dirs = fs.readdirSync('static/slot-configs/');

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
    if (!getAllConfigs().includes(name)) {
        throw new Error(`The config ${name} doesn't exists`);
    }

    const colors = JSON.parse(fs.readFileSync(`static/slot-configs/${name}/colors.json`, 'utf8'));
    const config: SlotConfig = {
        images: {
            10: `slot-configs/${name}/10.png`,
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
        },
        colors,
        name
    };
    return config;
}

const prob_normal = 93;

const weights_symbols: { [key: string]: number } = {
    '10': prob_normal,
    'J': prob_normal,
    'Q': prob_normal,
    'K': prob_normal,
    'A': prob_normal,
    'm1': 85,
    'm2': 80,
    'm3': 75,
    'm4': 65,
    'wild': 8000,
}




export const DEFAULT_SYMBOLS: SlotSymbol[] = [
    { name: '10', reward: 6 },
    { name: 'J', reward: 6 },
    { name: 'Q', reward: 6 },
    { name: 'K', reward: 6 },
    { name: 'A', reward: 6 },
    { name: 'm1', reward: 10 },
    { name: 'm2', reward: 15 },
    { name: 'm3', reward: 20 },
    { name: 'm4', reward: 30, },
    { name: 'wild', reward: 300 },
    // { name: 'bonus', reward: 700 }
];

let oldSymbolRand: SlotSymbol = DEFAULT_SYMBOLS[0];

export function getRandSymbol(symbols: SlotSymbol[] = DEFAULT_SYMBOLS): SlotSymbol {
    //Get random symbol using the weights
    //Get total from keys
    const total = Object.values(weights_symbols).reduce((a, b) => a + b, 0);


    //Get random number between 0 and total
    const rand = Math.floor(Math.random() * total);

    //Get a random chance to be next the same symbol (35%)
    if (Math.random() < 0.35) {
        return oldSymbolRand;
    }

    //http://www.randomnumberapi.com/api/v1.0/random?min=100&max=1000&count=5
    // const responseRandom = await fetch(`http://www.randomnumberapi.com/api/v1.0/random?min=0&max=${total}&count=1`);
    // const randJSON = await responseRandom.json();
    // const rand = randJSON[0];



    //Get the symbol from the random number
    let current = 0;
    for (const symbol of symbols) {
        current += weights_symbols[symbol.name];
        if (current >= rand) {
            oldSymbolRand = symbol;
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
                reward: DEFAULT_SYMBOLS.find(s => s.name === symbol)!.reward * 0.4,
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
                reward: DEFAULT_SYMBOLS.find(s => s.name === symbol)!.reward * 0.2,
                symbol,
                numberOfSymbol: 3
            });
            reward += lines[lines.length - 1].reward;
        }


    }

    //Order lines by reward
    lines.sort((a, b) => b.reward - a.reward);

    //Fixed reward to 2 decimals
    reward = Math.round(reward * 100) / 100;

    return { lines, reward };
}




//Random part
// Cette fonction simule un grand nombre de tours pour valider le taux de rendement
function validatePayoutRatio() {
    let bestPayout = 0;
    const trials = 10000000;
    let totalPayout = 0;

    for (let i = 0; i < trials; i++) {
        const symbolAllMatrix = getRandMatrixSymbol();
        const symbolMatrix = symbolAllMatrix.stringMatrix;
        const result = checkLines25(symbolMatrix[0], symbolMatrix[1], symbolMatrix[2], symbolMatrix[3], symbolMatrix[4]);
        const reward = result.reward;
        totalPayout += reward;

        if (reward > bestPayout) {
            bestPayout = reward;
            console.log(`New best payout: ${bestPayout}`);
        }

        if (i % (trials / 100) === 0) {
            console.log(`Progress: ${i / trials * 100}%`);
        }
    }

    const calculatedPayoutRatio = totalPayout / trials;
    console.log(`Calculated Payout Ratio: ${calculatedPayoutRatio}`);
    console.log(`Best Payout: ${bestPayout}`);
}

export function getRandMatrixSymbol(rows: number = 5) {
    //Check if rows not > 30
    if (rows > 30) {
        rows = 30;
    }
    const matrix = [];
    //5 columns
    for (let i = 0; i < 5; i++) {
        const column = [];
        //5 rows
        for (let j = 0; j < rows; j++) {
            column.push(getRandSymbol().name);
        }
        matrix.push(column);
    }

    //Bonus
    let bonus = false;

    const wildPosition: { x: number, y: number }[] = [];

    //BONUS: 1% chance to get 5 wilds
    if (Math.random() < 0.05 && rows > 5) {

        bonus = true;

        //Place 3 to 9 wilds
        const numberOfWilds = Math.floor(Math.random() * 7 + 3);
        for (let i = 0; i < numberOfWilds; i++) {
            let x = Math.floor(Math.random() * 5);
            let y = Math.floor(Math.random() * 3 + 1);

            while (wildPosition.some((pos) => pos.x === x && pos.y === y)) {
                x = Math.floor(Math.random() * 5);
                y = Math.floor(Math.random() * 3 + 1);
            }

            //replace symbol by wild
            matrix[x][y] = 'wild';
            wildPosition.push({ x, y });
        }
    }

    return {
        stringMatrix: matrix,
        bonus,
        wildPosition
    }
}

// validatePayoutRatio();   
