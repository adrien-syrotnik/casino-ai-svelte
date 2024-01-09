import type { StateImageGeneration } from "./openAPI.server";

export const AllImageToGenerate : StateImageGeneration[] = [
    {
        symbol: "10",
        prompt: (theme:string) => `Fait moi un symbole "10" à utiliser dans une machine à sous en ligne, avec un fond noir. Utilise le thème suivant : ${theme}`,
        status: "",
    },
    {
        symbol: "J",
        prompt: (theme:string) => `Fait moi un symbole "J" à utiliser dans une machine à sous en ligne, avec un fond noir. Utilise le thème suivant : ${theme}`,
        status: "",
    },
    {
        symbol: "Q",
        prompt: (theme:string) => `Fait moi un symbole "Q" à utiliser dans une machine à sous en ligne, avec un fond noir. Utilise le thème suivant : ${theme}`,
        status: "",
    },
    {
        symbol: "K",
        prompt: (theme:string) => `Fait moi un symbole "K" à utiliser dans une machine à sous en ligne, avec un fond noir. Utilise le thème suivant : ${theme}`,
        status: "",
    },
    {
        symbol: "A",
        prompt: (theme:string) => `Fait moi un symbole "A" à utiliser dans une machine à sous en ligne, avec un fond noir. Utilise le thème suivant : ${theme}`,
        status: "",
    },
    {
        symbol: "m1",
        prompt: (theme:string) => `Fait moi un petit symbole permettant des petits gains à utiliser dans une machine à sous en ligne, avec un fond noir. Utilise le thème suivant : ${theme}`,
        status: "",
    },
    {
        symbol: "m2",
        prompt: (theme:string) => `Fait moi un symbole moyen permettant des gains moyens à utiliser dans une machine à sous en ligne, avec un fond noir. Utilise le thème suivant : ${theme}`,
        status: "",
    },
    {
        symbol: "m3",
        prompt: (theme:string) => `Fait moi un gros symbole permettant des gros gains à utiliser dans une machine à sous en ligne, avec un fond noir. Utilise le thème suivant : ${theme}`,
        status: "",
    },
    {
        symbol: "m4",
        prompt: (theme:string) => `Fait moi un très gros symbole permettant des très gros gains à utiliser dans une machine à sous en ligne, avec un fond noir. Utilise le thème suivant : ${theme}`,
        status: "",
    },
    {
        symbol: "wild",
        prompt: (theme:string) => `Fait moi un symbole "wild" à utiliser dans une machine à sous en ligne, avec un fond noir. Fait apparaitre le mot "wild" sur le symbole. Utilise le thème suivant : ${theme}`,
        status: "",
    },
    // {
    //     symbol: "background",
    //     prompt: (theme:string) => `background image for an online slot machine, 1920x1080px, ${theme}`,
    //     status: "",
    //     sizeW: 1920,
    //     sizeH: 1080
    // }
]