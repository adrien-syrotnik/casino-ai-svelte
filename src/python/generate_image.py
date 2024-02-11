from diffusers import AutoPipelineForText2Image
import torch
import sys
import os

import torch
from diffusers import (
    StableDiffusionXLPipeline, 
    KDPM2AncestralDiscreteScheduler,
    AutoencoderKL
)

#get arguments from node.js
args = sys.argv[1:]

prompt = args[0]

print(args)

name_image = 'image.png'

if(len(args) > 1):
    name_image = args[1]

num_inference_steps = 5
if(len(args) > 2):
    num_inference_steps = int(args[2])

print("num_inference_steps: ", num_inference_steps)

height=512
width=512


# print(prompt)
        
# pipeline = AutoPipelineForText2Image.from_pretrained('dataautogpt3/OpenDalleV1.1', torch_dtype=torch.float16).to('cuda')


# pipeline = AutoPipelineForText2Image.from_pretrained('openskyml/dalle-3-xl', torch_dtype=torch.float16).to('cuda')  
# pipeline = DiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", use_safetensors=True)
    

# pipeline =  AutoPipelineForText2Image.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16).to('cuda')
    
# pipeline =  AutoPipelineForText2Image.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16).to('cuda')


# pipeline = DiffusionPipeline.from_pretrained("openskyml/dalle-3-xl", use_safetensors=True).to('cuda')
# pipeline = StableDiffusionPipeline.from_single_file(
#     "https://huggingface.co/openskyml/dalle-3-xl/blob/main/Dall-e_3_0.3-v2.safetensors"
# ).to('cuda')


#NEW

# Load VAE component
vae = AutoencoderKL.from_pretrained(
    "madebyollin/sdxl-vae-fp16-fix", 
    torch_dtype=torch.float16
)

# Configure the pipeline
pipeline = StableDiffusionXLPipeline.from_pretrained(
    "dataautogpt3/ProteusV0.2", 
    vae=vae,
    torch_dtype=torch.float16
)
pipeline.scheduler = KDPM2AncestralDiscreteScheduler.from_config(pipeline.scheduler.config)
pipeline.to('cuda')

# prompt = "black fluffy gorgeous dangerous cat animal creature, large orange eyes, big fluffy ears, piercing gaze, full moon, dark ambiance, best quality, extremely detailed"
negative_prompt = "bad quality, not symbol, worst quality, low quality, low resolutions, blur, blurry, ugly, wrongs proportions, watermark, image artifacts, lowres, ugly, jpeg artifacts, deformed, noisy image"



#Disable safety checker
def dummy(images, **kwargs):
    return images, False
pipeline.safety_checker = dummy

def progress(step, timestep, latents):
    print("step: ", step)
    sys.stdout.flush()


# https://huggingface.co/docs/diffusers/using-diffusers/conditional_image_generation

# image = pipeline(prompt, callback=progress, callback_steps=1, num_inference_steps=num_inference_steps, num_images_per_prompt=1, height=height, width=width).images[0]

# image = pipeline(prompt, callback=progress, callback_steps=1, num_inference_steps=num_inference_steps).images[0]

image = pipeline(
    prompt, 
    negative_prompt=negative_prompt, 
    width=1024,
    height=1024,
    guidance_scale=7,
    num_inference_steps=num_inference_steps,
).images[0]



# nb_images = 4

# images = pipeline(prompt, callback=progress, callback_steps=1, num_inference_steps=num_inference_steps, num_images_per_prompt=nb_images).images

# for i in range(nb_images):
#     image = images[i]
#     image.save(name_image + str(i) + '.png')




image.save(name_image)


print("done")

sys.stdout.flush()
