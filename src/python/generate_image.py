from diffusers import AutoPipelineForText2Image
import torch
import sys
import os

#get arguments from node.js
args = sys.argv[1:]

prompt = args[0]

name_image = 'image.png'

if(len(args) > 1):
    name_image = args[1]

num_inference_steps = 5
if(len(args) > 2):
    num_inference_steps = int(args[2])
    

# print(prompt)
        
# pipeline = AutoPipelineForText2Image.from_pretrained('dataautogpt3/OpenDalleV1.1', torch_dtype=torch.float16).to('cuda')  
# pipeline = AutoPipelineForText2Image.from_pretrained('openskyml/dalle-3-xl', torch_dtype=torch.float16).to('cuda')  
# pipeline = DiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", use_safetensors=True)
    
pipeline =  AutoPipelineForText2Image.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16).to('cuda')
# pipeline = DiffusionPipeline.from_pretrained("openskyml/dalle-3-xl", use_safetensors=True).to('cuda')
# pipeline = StableDiffusionPipeline.from_single_file(
#     "https://huggingface.co/openskyml/dalle-3-xl/blob/main/Dall-e_3_0.3-v2.safetensors"
# ).to('cuda')

def progress(step, timestep, latents):
    print("step: ", step)
    sys.stdout.flush()

     
# image = pipeline('"J" symbol sprite for an online slot machine, black background, 256x256px, a dark theme of batman').images[0]   
image = pipeline(prompt, callback=progress, callback_steps=1, num_inference_steps=num_inference_steps).images[0]


image.save(name_image)


print("done")

sys.stdout.flush()
