import os

from ultralytics import YOLO
from logger import create_logger

now = os.getcwd()
person_with_gun_model = YOLO(now + "/../../ml/models/epoch3500.pt")

logger = create_logger()