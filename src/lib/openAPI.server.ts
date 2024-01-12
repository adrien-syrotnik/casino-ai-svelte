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

export async function GenerateAllImagesLocal(theme: string, useBetterPrompt:boolean = false, apiKey:string = '', precision: number = 5) {
    currentImageGenerationTheme = theme;
    currentImageGenerationStep = 0;

    //Create the new folder
    await mkdir(`static/slot-configs/${theme}`, { recursive: true });

    //Generate all prompts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prompts: any;

    if (useBetterPrompt) {
        prompts = await GenerateAllPromptsForGenerateImages(theme, apiKey);

        //Write a json file with the prompts to keep them
        await writeFile(`static/slot-configs/${theme}/prompts-gpt.json`, JSON.stringify(prompts));
    }

    for (const state of AllImageToGenerate) {
        currentStateImageGeneration = state;

        const prompt = useBetterPrompt ? prompts[state.symbol] : state.prompt(theme);

        await GenerateImageLocal(prompt, `static/slot-configs/${theme}/${state.symbol}.png`, precision);
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

export async function GenerateAllImagesOpenAI(theme: string, apiKey: string, isDalle3: boolean, useBetterPrompt: boolean = false, precision: number = 5) {
    currentImageGenerationTheme = theme;
    currentImageGenerationStep = 0;

    //Create the new folder
    await mkdir(`static/slot-configs/${theme}`, { recursive: true });

    //Generate all prompts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prompts: any;

    if (useBetterPrompt) {
        prompts = await GenerateAllPromptsForGenerateImages(theme, apiKey);

        //Write a json file with the prompts to keep them
        await writeFile(`static/slot-configs/${theme}/prompts-gpt.json`, JSON.stringify(prompts));
    }

    for (const state of AllImageToGenerate) {
        currentStateImageGeneration = state;

        const prompt = useBetterPrompt ? prompts[state.symbol] : state.prompt(theme);

        await GenerateImageDalle3(prompt, apiKey, isDalle3, `static/slot-configs/${theme}/${state.symbol}.png`, precision);
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


export async function GenerateAllPromptsForGenerateImages(theme: string, apiKey: string) {

    // exemple:
    // const json = {
    //     "10": "Create an image that blends the number '10' with a theme inspired by Counter-Strike. The number should be stylized to resemble military stencil font, commonly used in army equipment, and imbued with a gritty, dark green camouflage pattern. The background should feature a subtle, abstract design that suggests a worn and battle-scarred environment, reminiscent of a map from the game.",
    //     "J": "Design an image that represents the letter 'J' as if it was part of the Counter-Strike universe. The letter should have the appearance of being made from heavy metallic materials, similar to a weapon's exterior, with screws and rivets. Include a faint hint of a digital heads-up display (HUD) in the background, with a slight blue neon glow to signify technology used in the game.",
    //     "Q": "Construct an image of the letter 'Q' with an aesthetic fitting for Counter-Strike. Render the letter as if it were composed of intertwined utility wires and tactical gear found in the game, with a digital bomb timer subtly integrated into the tail of the 'Q.' The color scheme should be muted tones with accents of red to symbolize the urgency of diffusing a bomb, set against a backdrop of a dimly-lit defusal map environment.",
    //     "K": "Generate an image of the letter 'K' that is associated with Counter-Strike themes. Visualize the 'K' with textures that mimic kevlar body armor, complete with a tactical vest pattern on the surface of the letter. The background should echo the appearance of a Counter-Strike safehouse, with concrete textures and a touch of urban graffiti.",
    //     "A": "Craft an image that showcases the letter 'A' in a style influenced by Counter-Strike. The letter should be adorned with a design that resembles an ammo crate, including small bullet details and a metallic, rugged texture. The background can have a hint of a radar screen, with green lines emulating the in-game radar overlay.",
    //     "m1": "Compose an image of a unique Counter-Strike symbol for 'm1,' which should represent the iconic AWP sniper rifle. The rifle should be illustrated in exquisite detail, with a focus on the sleek design and the long, menacing barrel. Incorporate elements like the scope and sniper crosshair, and set the rifle against a backdrop of a classic sniping spot in Dust II map, with the wallpaper color palette inspired by the desert setting.",
    //     "m2": "Create an image of a unique Counter-Strike symbol for 'm2,' which should encapsulate the essence of the AK-47 assault rifle. The image should capture the robust and reliable nature of the weapon, with wood grain texture on the grip and a well-worn metal finish. Position the AK-47 over a background suggestive of the gritty urban environment, similar to a location in the map Train, with a monochrome industrial color scheme.",
    //     "m3": "Illustrate an image of a unique Counter-Strike symbol for 'm3,' representing the M4A1-S assault rifle with its distinctive silencer. Render the rifle with accurate detailing of the suppressor and the sleek, modern design lines. Use a color palette reflecting the CT-side theme with hints of blue, and set against a backdrop that evokes a tactical situation room filled with high-tech equipment.",
    //     "m4": "Generate an image of a unique Counter-Strike symbol for 'm4,' depicting the P90 submachine gun known for its high rate of fire. The image should illustrate the compact design of the weapon with its signature oversized magazine. Employ a color scheme with dark grays and slight orange highlights, reminiscent of the gun's finish. The backdrop should be influenced by a close-quarters map section, like those found in the map Inferno, with warm colored walls and narrow passages.",
    //     "wild": "Design a dynamic and visually captivating image for the 'wild' symbol, deeply rooted in the Counter-Strike theme. The term 'wild' should be integrated into an explosive, action-filled scene, with vibrant, contrasting colors like electric blues, neon greens, and fiery oranges. Render the word 'wild' in a bold, stylized font that might resemble the bombastic flair of an in-game graffiti tag. Position it prominently over a chaotic backdrop of a Counter-Strike bomb site mid-explosion, with particles, and sparks radiate outward. Illuminate the whole scene with dramatic, focused lighting to enhance the symbol's presence and ensure it stands out in a slot machine lineup. The composition should be riveting, with the wild symbol taking center stage against the intense and thrilling world of Counter-Strike."
    //   }


    const openai = new OpenAI({
        apiKey
    });

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a text input assistant that is output JSON prompt for generating images using another AI for symbols in an online slot machine. Provide long, clear, unique and detailed instructions for each symbol. Use the following themes: " + theme + ".",
            },
            { role: "user", content: "Generate 9 prompts for generating images using DALL-E 3. Here are the symbols: " + AllImageToGenerate.map(s => s.symbol).join(", ") + ". For the symbols 'm1', 'm2', 'm3', 'm4', provide unique prompt that allow to generate a different image for each symbol. For the symbols '10', 'J', 'Q', 'K', 'A', provide a prompt that allow to generate image that represent the letter and number, they must be similar design. Finally, for the symbol 'wild', provide a prompt that allow to generate a dynamic and eye-catching sprite, incorporating vibrant colors and intricate details to evoke a sense of excitement, the word 'wild' should be prominently displayed within or around the symbol, using a bold and stylized font that complements the overall design. Consider the perspective by opting for a close-up view of the wild symbol, ensuring that its details are clearly visible. Illuminate the sprite with a dramatic and focused light source, enhancing the overall visual impact. The composition should be well-balanced, with the wild symbol positioned centrally against the black background. The JSON format must be: {'10': 'prompt', 'J': 'prompt', 'Q': 'prompt', 'K': 'prompt', 'A': 'prompt', 'm1': 'prompt', 'm2': 'prompt', 'm3': 'prompt', 'm4': 'prompt', 'wild': 'prompt'}. Here is the theme for the symbols: " + theme + "." },
        ],
        model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
    });
    console.log(completion);
    console.log(completion.choices[0].message.content);

    //Get the json from the response
    const json = JSON.parse(completion.choices[0].message.content!);


    return json;

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