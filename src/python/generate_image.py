from diffusers import AutoPipelineForText2Image
import torch
import sys
import os

#get arguments from node.js
args = sys.argv[1:]

prompt = args[0]
name_image = args[1]

if(name_image == ''):
    name_image = 'image.png'

# print(prompt)
        
pipeline = AutoPipelineForText2Image.from_pretrained('dataautogpt3/OpenDalleV1.1', torch_dtype=torch.float16).to('cuda')        
# image = pipeline('"J" symbol sprite for an online slot machine, black background, 256x256px, a dark theme of batman').images[0]
image = pipeline(prompt).images[0]


image.save(name_image)


print("done")

sys.stdout.flush()
