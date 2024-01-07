import { env } from '$env/dynamic/private';
import { writeFile } from 'node:fs/promises';
import fetch from "node-fetch";

// import {readFileSync} from "fs"
import OpenAI from "openai";

// const openai = new OpenAI({
//     apiKey: env.OPENAI_API_KEY
// });


export async function testDalle() {
    const url = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-4UxCctuaSkHOGTR8GuMtT2V9/user-J4RjO6EIdr0aj4HVCZn5oeaO/img-kcELebkGHAMDjNeioyqRe3di.png?st=2024-01-07T16%3A47%3A32Z&se=2024-01-07T18%3A47%3A32Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-07T14%3A23%3A14Z&ske=2024-01-08T14%3A23%3A14Z&sks=b&skv=2021-08-06&sig=MVoHJAf3ZU%2BLOXCTRKnP7FHSay4rCPjTL3fQJ0%2BeDAQ%3D"
    // const response = await openai.images.generate({
    //     model: "dall-e-3",
    //     prompt: "a white siamese cat",
    //     n: 1,
    //     size: "256x256",
    // });


    // console.log(response.data[0].url)
    // console.log(response.data[0].b64_json)
    // //Download image and store it
    // if (response.data[0].url) {
    //     const image = await fetch(response.data[0].url);
    //     const buffer = await image.buffer();
    //     await writeFile("public/dalle.png", buffer);
    // }
    // const image = await fetch(url);
    // const buffer = await image.buffer();
    // //Create new file
    // await writeFile("uploads/dalle.png", buffer);

    // const Test_prompt_theme = "A dark theme of batman"
    // generateColorPalette(Test_prompt_theme);


}


export function generateSlotSpriteSheets(prompt_theme: string) {

    //Generate all symbols (10, J, Q, K, A)
    // const symbols = ["10", "J", "Q", "K", "A", "m1", "m2", "m3", "m4", "wild"];
    // const prompt = symbols.map(symbol => `a ${symbol} symbol sprite for an online slot machine, black background, 256x256px, ${prompt_theme}`).join("\n");

    // Generate 4 random medium symbols and get the 4 ideas

    //Generate the wild with the text

    //Generate Background image




}

async function generateColorPalette(prompt_theme: string) {
    //Get color palette from prompt_theme (primary, secondary, tertiary, success, error, background)
    // const completion = await openai.chat.completions.create({
    //   messages: [
    //     {
    //       role: "system",
    //       content: "You are a helpful assistant designed to output JSON colored palettes.",
    //     },
    //     { role: "user", content: "Generate a color palette composed of primary, secondary, tertiary, success, error, background colors, from the theme " + prompt_theme },
    //   ],
    //   model: "gpt-3.5-turbo-1106",
    //   response_format: { type: "json_object" },
    // });
    // console.log(completion.choices[0].message.content);
  }