import base64
import cv2
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

import av
from shared_files import person_with_gun_model, logger

router = APIRouter()

@router.websocket("/api/camera")
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

                    results = person_with_gun_model(image)

                    frame = results[0].plot()

                    sus_res = len(results[0].boxes.cls) > 0     # TODO: Add classification model
                    if (sus_res and sus_i == -1):
                        sus_i = 0
                        sus = True
                    else:
                        sus = False

                    if (sus_i != timeout and sus_i != -1):
                        sus_i += desired_frame_rate
                    else:
                        sus_i = -1

                    frame_with_boxes_bytes = base64.b64encode(cv2.imencode(
                        '.jpg', frame)[1].tobytes()).decode()

                    await websocket.send_json({"image": frame_with_boxes_bytes, "sus": sus})
