import base64
import os
import cv2
import av
import shutil

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile

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

logger = create_logger()

model = YOLO('model/yolov8n.pt')

tmp_file = 0

@app.post("/api/video")
async def post_detect_video(file: UploadFile):
    global tmp_file
    if tmp_file != 0:
        tmp_file.close()

    file_path_video = "./tmp/video.mp4"
    if (os.path.isfile(file_path_video)):
        os.remove(file_path_video)
        logger.info("File deleted")

    dir_path_image = "./tmp/images/"
    if (len([name for name in os.listdir(dir_path_image) if os.path.isfile(os.path.join(dir_path_image, name))]) > 0):
        shutil.rmtree(dir_path_image)
        os.mkdir(dir_path_image)
        logger.info("Images deleted")

    try:
        if not file.content_type.startswith("video"):
            raise HTTPException(status_code=415, detail="Unsupported media type")

        format_container = file.content_type.rsplit("/")[1]
        logger.info(format_container)

        with av.open(file.file, format=format_container) as in_container:
            in_stream = next((s for s in in_container.streams if s.type == 'video'), None)
            if not in_stream:
                return JSONResponse(content={"error": "Video stream not found in file"}, status_code=500)
            in_stream.thread_type = "FRAME"
            
            fps = in_stream.base_rate
            if (in_stream.width > in_stream.height):
                width = 640
                height = in_stream.height / (in_stream.width / width)
            else:
                height = 480
                width = in_stream.width / (in_stream.height / height)

            out_container = av.open(file_path_video, 'w')
            out_stream = out_container.add_stream(in_stream.codec_context.name, rate=fps)
            out_stream.width = width
            out_stream.height = height

            timeout = fps * 1
            logger.info(f"Timeout: {timeout}")
            sus_i = -1
            for packet in in_container.demux(in_stream):
                if packet.dts is None:
                    continue
                for frame in packet.decode():

                    frame = frame.reformat(width, height)
                    image = frame.to_image()

                    results = model(image)

                    img_array = results[0].plot()

                    sus_res = True    # TODO: Add classification model
                    if (sus_res and (sus_i == -1)):
                        sus_i = frame.index + timeout
                        logger.info("Suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuus")
                        cv2.imwrite(dir_path_image + str(frame.index) + ".jpg", img_array)

                    if (sus_i == frame.index):
                        sus_i = -1

                    frame = av.VideoFrame.from_ndarray(img_array, format='bgr24')
                    for packet in out_stream.encode(frame):
                        out_container.mux(packet)
            
            for packet in out_stream.encode():
                out_container.mux(packet)

            out_container.close()

        return {"status": "ok"}
    except Exception as e:
        logger.info(e.args)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/video")
async def get_detect_video():
    global tmp_file
    file_path = "./tmp/video.mp4"
    try:
        tmp_file = open(file_path, "rb")
        return StreamingResponse(tmp_file, media_type="video/mp4", status_code=200)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Can't open file")

@app.get("/api/video/image")
async def get_image_from_detect_video():
    dir_path_image = "./tmp/images/"
    image_paths = [os.path.join(dir_path_image, name) for name in os.listdir(dir_path_image) if os.path.isfile(os.path.join(dir_path_image, name))]
    try:
        images = []
        for path in image_paths:
            with open(path, "rb") as file:
                images.append(base64.b64encode(file.read()).decode())
        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)

# Function to capture video frames from the webcam
async def video_stream_capture(rtsp_url, websocket):
    with av.open(rtsp_url) as container:
        logger.info("container open!")
        stream = container.streams.video[0]
        stream.thread_type = "FRAME"
        # stream.codec_context.skip_frame = "NONKEY"

        stream.thread_count = 4

        base_fps = stream.base_rate
        desired_frame_rate = 5
        i = 0
        sus_i = -1
        timeout = base_fps * 5

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

                    sus_res = False     # TODO: Add classification model
                    if (sus_res and sus_i == -1):
                        sus_i = 0
                        sus = True
                    else:
                        sus = False

                    if (sus_i != timeout and sus_i != -1):
                        sus_i += 1
                    else:
                        sus_i = -1

                    frame_with_boxes_bytes = base64.b64encode(cv2.imencode(
                        '.jpg', frame)[1].tobytes()).decode()

                    await websocket.send_json({"image": frame_with_boxes_bytes, "sus": sus})


@app.websocket("/api/camera")
async def get_stream_camera(websocket: WebSocket):
    logger.info("Start WebSocket connection")
    await websocket.accept()
    try:
        while True:
            rtsp_url = await websocket.receive_text()
            logger.info(rtsp_url)
            await video_stream_capture(rtsp_url, websocket)
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
