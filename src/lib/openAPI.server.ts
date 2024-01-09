import { env } from '$env/dynamic/private';
import { mkdir, writeFile } from 'node:fs/promises';
import fetch from "node-fetch";
import { spawn } from "child_process";

// import {readFileSync} from "fs"
import OpenAI from "openai";
import { HfInference } from "@huggingface/inference";
import { AllImageToGenerate } from './states-image-generation';


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





export interface StateImageGeneration {
    prompt: (theme: string) => string,
    status: string,
    symbol: string,
    sizeW?: number,
    sizeH?: number
}

export let currentStateImageGeneration: StateImageGeneration = {
    prompt: () => "",
    status: "",
    symbol: "",
}

export let currentImageGenerationTheme: string = "";
export let currentImageGenerationStep: number = 0;

export function resetImageGeneration() {
    currentImageGenerationTheme = "";
    currentImageGenerationStep = 0;
}

export async function GenerateAllImagesLocal(theme: string, precision: number = 5) {
    currentImageGenerationTheme = theme;
    currentImageGenerationStep = 0;

    //Create the new folder
    await mkdir(`static/slot-configs/${theme}`, { recursive: true });

    for (const state of AllImageToGenerate) {
        currentStateImageGeneration = state;
        await GenerateImageLocal(state.prompt(theme), `static/slot-configs/${theme}/${state.symbol}.png`, precision);
        currentImageGenerationStep++;
    }

    //After finished, generate the color palette in a new file : colors.json
    // const colors = await generateColorPalette(theme);

    //For now, use random colors
    const colors = {
        primary: "#000000",
        secondary: "#000000",
        tertiary: "#000000",
        success: "#000000",
        error: "#000000",
        background: "#000000"
    }

    await writeFile(`static/slot-configs/${theme}/colors.json`, JSON.stringify(colors));


    currentImageGenerationTheme = "";
    currentImageGenerationStep = 0;

}

export async function GenerateAllImagesOpenAI(theme: string, apiKey: string, isDalle3: boolean, precision: number = 5) {
    currentImageGenerationTheme = theme;
    currentImageGenerationStep = 0;

    //Create the new folder
    await mkdir(`static/slot-configs/${theme}`, { recursive: true });

    for (const state of AllImageToGenerate) {
        currentStateImageGeneration = state;
        await GenerateImageDalle3(state.prompt(theme), apiKey, isDalle3, `static/slot-configs/${theme}/${state.symbol}.png`, precision);
        currentImageGenerationStep++;
    }

    //After finished, generate the color palette in a new file : colors.json
    // const colors = await generateColorPalette(theme);

    //For now, use random colors
    const colors = {
        primary: "#000000",
        secondary: "#000000",
        tertiary: "#000000",
        success: "#000000",
        error: "#000000",
        background: "#000000"
    }

    await writeFile(`static/slot-configs/${theme}/colors.json`, JSON.stringify(colors));


    currentImageGenerationTheme = "";
    currentImageGenerationStep = 0;

}




export async function GenerateImageLocal(prompt: string, name: string, finishStep = 5) {

    currentStateImageGeneration.status = "Starting image generation...";

    const t = spawn('src/python/image-generator-env/Scripts/python', ["src/python/generate_image.py", prompt, name, finishStep.toString()]);

    await new Promise(resolve => {
        t.stdout.on('data', (data: string) => {
            data = data.toString();
            console.log(`stdout: ${data}`);

            //Check there is "step: " in the data
            if (data.includes("step: ")) {
                const step = parseInt(data.split("step: ")[1].split("\n")[0]);

                //If last step, set status "finalizing..."
                if (step + 1 == finishStep) {
                    currentStateImageGeneration.status = "Finalizing image...";
                } else {
                    currentStateImageGeneration.status = `Generating image... (${step + 1}/${finishStep})`;
                }
            }
        });
        t.on('exit', resolve);
    });
}



export async function GenerateImageDalle3(prompt: string, apiKey: string, isDalle3: boolean, name: string, finishStep = 5) {

    
        const openai = new OpenAI({
            apiKey
        });

        currentStateImageGeneration.status = "Generating image using DALL-E...";
        
        const response = await openai.images.generate({
            model: isDalle3 ? "dall-e-3" : "dall-e-2",
            prompt,
            // quality: 'standard', -> only for DALL-E 3
            n: 1,
            size: isDalle3 ? "1024x1024" : "256x256"
        });

        currentStateImageGeneration.status = "Downloading image...";

        console.log(response.data[0].url);
        //Download image and store it
        if (response.data[0].url) {
            const image = await fetch(response.data[0].url);
            const buffer = await image.buffer();
            await writeFile(name, buffer);
            return;
        }

        throw new Error("Dalle: No image generated");
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