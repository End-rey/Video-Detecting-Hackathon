import base64
import io
import cv2
import av
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile
import numpy as np

from ultralytics import YOLO
from logger import create_logger

app = FastAPI(
    openapi_url="/api/restdocs",
    docs_url="/api/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создаем логгер
logger = create_logger()

model = YOLO('model/yolov8n.pt')
# model.cpu()

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
    with av.open(rtsp_url) as container:
        logger.info("container open!")
        stream = container.streams.video[0]
        stream.thread_type = "FRAME"
        # stream.codec_context.skip_frame = "NONKEY"

        stream.thread_count = 4

        base_fps = stream.base_rate
        desired_frame_rate = 5
        i = 0

        logger.info(f"Base rate: {stream.base_rate}")
        for frame in container.decode(stream):
            if frame:
                i += 1
                if i == base_fps:
                    i = 0
                if i % (base_fps / desired_frame_rate) == 0:
                    logger.info(f"Frame:{frame}")
                    frame = frame.reformat(640, 480)
                    image = frame.to_image()

                    results = model(image)

                    frame = results[0].plot()

                    frame_with_boxes_bytes = base64.b64encode(cv2.imencode(
                        '.jpg', frame)[1].tobytes()).decode()

                    await websocket.send_text(frame_with_boxes_bytes)


@app.websocket("/api/videoCamera")
async def get_video_feed(websocket: WebSocket):
    logger.info("Start WebSocket connection")
    await websocket.accept()
    try:
        while True:
            rtsp_url = await websocket.receive_text()
            logger.info(rtsp_url)
            await video_capture(rtsp_url, websocket)
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await websocket.close()


@app.get("/api/ping")
async def ping():
    return {"ping": "nice"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
