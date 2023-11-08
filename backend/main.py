import base64
import io
import cv2
import av
from fastapi import FastAPI, Request, Response, WebSocket
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile
from fastapi.templating import Jinja2Templates
import numpy as np
import urllib.parse
from fastapi import status, HTTPException
from contextlib import closing

from ultralytics import YOLO
import websockets

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
# model.cpu()

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
async def video_capture(rtsp_url, websocket):
    # rtsp_url = "rtsp://admin:A1234567@188.170.176.190:8028/Streaming/Channels/101?transportmode=unicast&profile=Profile_1"
    print(rtsp_url)
    with closing(av.open(rtsp_url)) as container:
        stream = container.streams.video[0]
        stream.thread_type = "FRAME"
        # stream.codec_context.skip_frame = "NONKEY"

        stream.thread_count = 4

        base_fps = stream.base_rate
        desired_frame_rate = 5
        i = 0

        for frame in container.decode(stream):
            if frame:
                i += 1
                if i == base_fps:
                    i = 0
                if i % (base_fps / desired_frame_rate) == 0:
                    frame = frame.reformat(640, 480)
                    image = frame.to_image()

                    # frame = np.array(image)

                    results = model(image)

                    frame = results[0].plot()

                    frame_with_boxes_bytes = base64.b64encode(cv2.imencode(
                        '.jpg', frame)[1].tobytes()).decode()

                    # yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame_with_boxes_bytes + b"\r\n")
                    await websocket.send_text(frame_with_boxes_bytes)



@app.websocket("/api/videoCamera")
async def get_video_feed(websocket: WebSocket):
    print("aleeeeee")
    await websocket.accept()

    # try:
    #     gen = video_capture(rtsp_url)
    #     response = StreamingResponse(gen, media_type="multipart/x-mixed-replace; boundary=frame")
    # except Exception as e:
    #     raise HTTPException(detail=e, status_code=status.HTTP_404_NOT_FOUND)
    # return response
    try:
        while True:
            rtsp_url = await websocket.receive_text()
            await video_capture(rtsp_url, websocket)
    except Exception as e:
        raise HTTPException(detail=e, status_code=400)
    finally:
        await websocket.close()


@app.get("/api/ping")
async def ping():
    return {"ping": "nice"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
