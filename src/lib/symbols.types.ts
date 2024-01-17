export type SlotSymbol = {
    name: '10' | 'J' | 'Q' | 'K' | 'A' | 'm1' | 'm2' | 'm3' | 'm4' | 'wild';
    reward: number;
    image?: string;
};



export type SlotConfig = {
    images: {
        '10': string;
        'J': string;
        'Q': string;
        'K': string;
        'A': string;
        'm1': string;
        'm2': string;
        'm3': string;
        'm4': string;
        'wild': string;
        'background': string; 
    },
    colors: {
        primary: string;
        secondary: string;
        tertiary: string;
        success: string;
        error: string;
        background: string;
    };
    name: string;
};
