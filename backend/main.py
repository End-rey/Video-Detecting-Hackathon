import io
import cv2
from fastapi import FastAPI, Request, Response
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile
from fastapi.templating import Jinja2Templates
import numpy as np
import urllib.parse

from ultralytics import YOLO

app = FastAPI(
    openapi_url="/api/restdocs",
    docs_url="/api/docs",
)

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

@app.post("/api/image")
async def image_detect(file: UploadFile):
    content = await file.read()
    nparr = np.fromstring(content, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR).astype(np.float32)
    result = model(img)
    annotated_frame = result[0].plot()
    frame_with_boxes_bytes = cv2.imencode(
            '.jpg', annotated_frame)[1].tobytes()
    return StreamingResponse(io.BytesIO(frame_with_boxes_bytes), media_type="image/jpeg")

# Function to capture video frames from the webcam
def video_capture(rtcp_url):
    cap = cv2.VideoCapture(rtcp_url)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, 30)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # if frame.shape[0] >= 480:
        #     frame = cv2.resize(frame, (640, 480))

        results = model(frame)

        frame = results[0].plot()

        frame_with_boxes_bytes = cv2.imencode(
            '.jpg', frame)[1].tobytes()

        yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame_with_boxes_bytes + b"\r\n")


@app.get("/api/videoCamera")
async def get_video_feed(url: str):
    rtcp_url = urllib.parse.unquote(url)
    # request_body = await request.json()
    # rtcp_url = request_body.get("rtcp_url")

    return StreamingResponse(video_capture(rtcp_url), media_type="multipart/x-mixed-replace; boundary=frame")


@app.get("/api/ping")
async def ping():
    return {"ping": "nice"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
