import os

import modal
from fastapi import Header

app = modal.App("image-generator")

image = modal.Image.debian_slim().pip_install("diffusers", "transformers", "accelerate", "fastapi[standard]")

with image.imports():
    from diffusers import AutoPipelineForText2Image
    import torch

    import io
    from fastapi import Response, HTTPException, Header


@app.cls(image=image, gpu="A10G", secrets=[modal.Secret.from_name("image-generator-secrets")])
class Model:
    @modal.build()
    @modal.enter()
    def load_weights(self):
        self.pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16"
        )
        self.pipe.to("cuda")

    @modal.web_endpoint()
    def generate(
            self,
            prompt: str,
            api_key: str = Header(..., description="API key required for authentication")
    ):
        expected_api_key = os.environ["API_KEY"]

        if expected_api_key != api_key:
            raise HTTPException(status_code=401, detail="Invalid API key")

        image = self.pipe(
            prompt=prompt, num_inference_steps=1, guidance_scale=0.0
        ).images[0]

        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")
        return Response(content=buffer.getvalue(), media_type="image/jpeg")
