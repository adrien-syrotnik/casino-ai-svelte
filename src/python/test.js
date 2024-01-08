import { spawn } from "child_process";


const spawnPromise = (cmd, args) => {
    return new Promise((resolve, reject) => {
        try {
            const runCommand = spawn(cmd, args);
            runCommand.stdout.on('data', data => resolve(data.toString()));
            runCommand.on('error', err => {
                throw new Error(err.message);
            });
        } catch (e) {
            reject(e);
        }
    });
};

console.log("starting")
// const prompt = "'J' symbol sprite for an online slot machine, black background, 256x256px, a dark theme of batman"

const prompt = `Generate a striking image using DALL·E 3 that features a wild symbol sprite for an online slot machine. The background should be a deep black, creating a stark contrast to highlight the main elements. The wild symbol should be a dynamic and eye-catching sprite, incorporating vibrant colors and intricate details to evoke a sense of excitement.

    Specify that the wild symbol itself should be composed of various shapes, perhaps resembling a combination of stars, diamonds, and swirls, symbolizing its unpredictability and dynamic nature. The text "wild" should be prominently displayed within or around the symbol, using a bold and stylized font that complements the overall design.
    
    Consider the perspective by opting for a close-up view of the wild symbol, ensuring that its details are clearly visible. Illuminate the sprite with a dramatic and focused light source, enhancing the overall visual impact. The composition should be well-balanced, with the wild symbol positioned centrally against the black background.
    
    Infuse the image with a lively and energetic mood, capturing the essence of the excitement associated with slot machines. The overall style should be modern and sleek, with a touch of fantasy to make it visually captivating.
    
    Feel free to iterate on the results, refining the prompt based on the generated images to achieve the desired level of detail and visual appeal.`;

const result = await spawnPromise('/src/python/image-generator-env/Scripts/python', ["/src/python/generate_image.py", prompt]);

console.log(result)
