import cv2
from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from ultralytics import YOLO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO('model/yolov8n.pt')
model.cpu()

templates = Jinja2Templates(directory="static")

@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse("yolo8.html", context={"request": request})

# Function to capture video frames from the webcam
def video_capture():
    cap = cv2.VideoCapture(1)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (640, 480))
        
        results = model(frame)

        annotated_frame = results[0].plot()

        frame_with_boxes_bytes = cv2.imencode('.jpg', annotated_frame)[1].tobytes()
        
        yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame_with_boxes_bytes + b"\r\n")

@app.get("/videoCamera")
async def get_video_feed():
    return StreamingResponse(video_capture(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/ping")
async def ping():
    return {"ping": "nice"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080, log_level="debug")