import type { StateImageGeneration } from "./openAPI.server";

export const AllImageToGenerate : StateImageGeneration[] = [
    {
        symbol: "10",
        prompt: (theme:string) => `'10' symbol sprite for an online slot machine, black background, 256x256px, ${theme}`,
        status: "",
    },
    {
        symbol: "J",
        prompt: (theme:string) => `'J' symbol sprite for an online slot machine, black background, 256x256px, ${theme}`,
        status: "",
    },
    {
        symbol: "Q",
        prompt: (theme:string) => `'Q' symbol sprite for an online slot machine, black background, 256x256px, ${theme}`,
        status: "",
    },
    {
        symbol: "K",
        prompt: (theme:string) => `'K' symbol sprite for an online slot machine, black background, 256x256px, ${theme}`,
        status: "",
    },
    {
        symbol: "A",
        prompt: (theme:string) => `'A' symbol sprite for an online slot machine, black background, 256x256px, ${theme}`,
        status: "",
    },
    {
        symbol: "m1",
        prompt: (theme:string) => `small symbol reward sprite for an online slot machine, black background, 256x256px, ${theme}`,
        status: "",
    },
    {
        symbol: "m2",
        prompt: (theme:string) => `medium symbol reward sprite for an online slot machine, black background, 256x256px, ${theme}`,
        status: "",
    },
    {
        symbol: "m3",
        prompt: (theme:string) => `big symbol reward sprite for an online slot machine, black background, 256x256px, ${theme}`,
        status: "",
    },
    {
        symbol: "m4",
        prompt: (theme:string) => `huge symbol reward sprite for an online slot machine, black background, 256x256px, ${theme}`,
        status: "",
    },
    {
        symbol: "wild",
        prompt: (theme:string) => `wild symbol sprite for an online slot machine, black background, 256x256px, ${theme}`,
        status: "",
    },
    {
        symbol: "background",
        prompt: (theme:string) => `background image for an online slot machine, 1920x1080px, ${theme}`,
        status: "",
        sizeW: 1920,
        sizeH: 1080
    }
]