from ultralytics import YOLO
from logger import create_logger

model = YOLO('model/yolov8n.pt')

logger = create_logger()