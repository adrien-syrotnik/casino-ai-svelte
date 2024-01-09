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
        
pipeline = AutoPipelineForText2Image.from_pretrained('dataautogpt3/OpenDalleV1.1', torch_dtype=torch.float16).to('cuda')  
def progress(step, timestep, latents):
    print("step: ", step)
    sys.stdout.flush()
    # print(step, timestep, latents[0][0][0][0])      
# image = pipeline('"J" symbol sprite for an online slot machine, black background, 256x256px, a dark theme of batman').images[0]   
image = pipeline(prompt, callback=progress, callback_steps=1, num_inference_steps=num_inference_steps).images[0]


image.save(name_image)


print("done")

sys.stdout.flush()
