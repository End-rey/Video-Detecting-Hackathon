import os

from ultralytics import YOLO
from logger import create_logger

now = os.getcwd()
person_with_gun_model = YOLO(now + "/../../ml/models/epoch3500.pt")
yolo8_pose = YOLO(now + "/../../ml/models/yolov8s-pose.pt")

logger = create_logger()