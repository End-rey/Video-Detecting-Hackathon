import base64
from fastapi import APIRouter, Body, HTTPException, Response
import numpy as np
import os

from pydantic import BaseModel
from torch import Tensor

router = APIRouter()

class DetectImage(BaseModel):
    resOfPerson: int
    box: list[list[float]]

dir_train = "../dataset/train"
if not os.path.exists(dir_train):
    os.mkdir("../dataset")
    os.mkdir(dir_train)

@router.post("/")
async def post_image_to_train(response: Response, item: DetectImage = Body(...)):
    try:
        return {"message": "Image saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving image: {str(e)}")

def save_base64_image(base64_string, file_path):
    _, data = base64_string.split(',')

    binary_data = base64.b64decode(data)

    with open(file_path, 'wb') as f:
        f.write(binary_data)