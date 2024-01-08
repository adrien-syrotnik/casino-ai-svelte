import { env } from '$env/dynamic/private';
import { writeFile } from 'node:fs/promises';
import fetch from "node-fetch";
import { spawn } from "child_process";

// import {readFileSync} from "fs"
import OpenAI from "openai";
import { HfInference } from "@huggingface/inference";

// const openai = new OpenAI({
//     apiKey: env.OPENAI_API_KEY
// });

// import { DiffusionPipeline } from '@aislamov/diffusers.js'
// import { PNG } from 'pngjs'


export async function testHugginModel() {

    try {

        // const pipe = DiffusionPipeline.fromPretrained('aislamov/stable-diffusion-2-1-base-onnx')
        // const images = pipe.run({
        //     prompt: "an astronaut running a horse",
        //     numInferenceSteps: 30,
        // })

        // const data = await images[0].mul(255).round().clipByValue(0, 255).transpose(0, 2, 3, 1)

        // // const image = await fetch(url);
        // const buffer = Buffer.from(data.data);
        // //Create new file
        // await writeFile("static/dalle.png", buffer);

        // const p = new PNG({ width: 512, height: 512, inputColorType: 2 })
        // p.data = Buffer.from(data.data)
        // p.pack().pipe(fs.createWriteStream('output.png')).on('finish', () => {
        //     console.log('Image saved as output.png');
        // })


        console.log(env.HF_TOKEN)
        const HF_TOKEN = env.HF_TOKEN;

        const inference = new HfInference(HF_TOKEN);

        const prompt = `Generate a striking image using DALL·E 3 that features a wild symbol sprite for an online slot machine. The background should be a deep black, creating a stark contrast to highlight the main elements. The wild symbol should be a dynamic and eye-catching sprite, incorporating vibrant colors and intricate details to evoke a sense of excitement.

    Specify that the wild symbol itself should be composed of various shapes, perhaps resembling a combination of stars, diamonds, and swirls, symbolizing its unpredictability and dynamic nature. The text "wild" should be prominently displayed within or around the symbol, using a bold and stylized font that complements the overall design.
    
    Consider the perspective by opting for a close-up view of the wild symbol, ensuring that its details are clearly visible. Illuminate the sprite with a dramatic and focused light source, enhancing the overall visual impact. The composition should be well-balanced, with the wild symbol positioned centrally against the black background.
    
    Infuse the image with a lively and energetic mood, capturing the essence of the excitement associated with slot machines. The overall style should be modern and sleek, with a touch of fantasy to make it visually captivating.
    
    Feel free to iterate on the results, refining the prompt based on the generated images to achieve the desired level of detail and visual appeal.`;


        const prompt2 = "'J' symbol sprite for an online slot machine, black background, 256x256px, a dark theme of batman"

        const data = await inference.textToImage({
            // model: 'stabilityai/stable-diffusion-2',
            // model: 'dataautogpt3/OpenDalleV1.1',
            // model: 'runwayml/stable-diffusion-v1-5',
            model: 'stabilityai/stable-diffusion-xl-base-1.0',
            inputs: prompt2,
            parameters: {
                // negative_prompt: 'blurry',
                // height: 1024,
                // width: 1024,
            }
        })

        console.log(data)
        const buffer = await data.arrayBuffer();
        const text = await data.text()

        console.log(text)
        console.log(buffer)
        //Create new file
        await writeFile("static/dalle.png", Buffer.from(buffer));

        // Using your own inference endpoint: https://hf.co/docs/inference-endpoints/
        // const gpt2 = inference.endpoint('https://xyz.eu-west-1.aws.endpoints.huggingface.cloud/gpt2');
        // const { generated_text } = await gpt2.textGeneration({ inputs: 'The answer to the universe is' });



    } catch (e) {
        console.log(e)
    }
}


export async function GenerateImage(prompt: string, name: string) {
    const t = spawn('src/python/image-generator-env/Scripts/python', ["src/python/generate_image.py", prompt, name]);

    await new Promise(resolve => {
        t.on('exit', resolve);
    });
}


export async function testDalleLocal() {
    console.log("testDalleLocal")
        // const prompt = "'J' symbol sprite for an online slot machine, black background, 256x256px, a dark theme of batman"

        const prompt = `Generate a striking image using DALL·E 3 that features a wild symbol sprite for an online slot machine. The background should be a deep black, creating a stark contrast to highlight the main elements. The wild symbol should be a dynamic and eye-catching sprite, incorporating vibrant colors and intricate details to evoke a sense of excitement.

Specify that the wild symbol itself should be composed of various shapes, perhaps resembling a combination of stars, diamonds, and swirls, symbolizing its unpredictability and dynamic nature. The text "wild" should be prominently displayed within or around the symbol, using a bold and stylized font that complements the overall design.

Consider the perspective by opting for a close-up view of the wild symbol, ensuring that its details are clearly visible. Illuminate the sprite with a dramatic and focused light source, enhancing the overall visual impact. The composition should be well-balanced, with the wild symbol positioned centrally against the black background.

Infuse the image with a lively and energetic mood, capturing the essence of the excitement associated with slot machines. The overall style should be modern and sleek, with a touch of fantasy to make it visually captivating.

Feel free to iterate on the results, refining the prompt based on the generated images to achieve the desired level of detail and visual appeal.`;



    await GenerateImage(prompt, "dalle.png");
    console.log("testDalleLocal done")


}


export async function testDalle() {
    const url = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-4UxCctuaSkHOGTR8GuMtT2V9/user-J4RjO6EIdr0aj4HVCZn5oeaO/img-kcELebkGHAMDjNeioyqRe3di.png?st=2024-01-07T16%3A47%3A32Z&se=2024-01-07T18%3A47%3A32Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-07T14%3A23%3A14Z&ske=2024-01-08T14%3A23%3A14Z&sks=b&skv=2021-08-06&sig=MVoHJAf3ZU%2BLOXCTRKnP7FHSay4rCPjTL3fQJ0%2BeDAQ%3D"


    // const response = await openai.images.generate({
    //     model: "dall-e-2",
    //     prompt,
    //     n: 4,
    //     size: "256x256"
    // });


    // console.log(response.data[0].url)
    // console.log(response.data[0].b64_json)
    // //Download image and store it
    // if (response.data[0].url) {
    //     const image = await fetch(response.data[0].url);
    //     const buffer = await image.buffer();
    //     await writeFile("static/dalle.png", buffer);
    // }
    // const image = await fetch(url);
    // const buffer = await image.buffer();
    // //Create new file
    // await writeFile("static/dalle.png", buffer);

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