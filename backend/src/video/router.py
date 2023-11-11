import base64
import os
import shutil
import av
import cv2

from fastapi import APIRouter, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from shared_files import person_with_gun_model, logger

router = APIRouter()

tmp_file = 0
# dir_path_image = "./video/tmp/images/"
file_path_video = "./video/tmp/video.mp4"
if not os.path.exists("./video/tmp"):
    os.mkdir("./video/tmp")
    # os.mkdir(dir_path_image)

images = []


@router.post("/")
async def post_detect_video(file: UploadFile):
    global tmp_file, images
    if tmp_file != 0:
        tmp_file.close()

    if (os.path.isfile(file_path_video)):
        os.remove(file_path_video)
        logger.info("File deleted")

    # if (len([name for name in os.listdir(dir_path_image) if os.path.isfile(os.path.join(dir_path_image, name))]) > 0):
    #     shutil.rmtree(dir_path_image)
    #     os.mkdir(dir_path_image)
    #     logger.info("Images deleted")
    if len(images) > 0:
        images = []

    try:
        if not file.content_type.startswith("video"):
            raise HTTPException(
                status_code=415, detail="Unsupported media type")

        format_container = file.content_type.rsplit("/")[1]
        logger.info(format_container)

        with av.open(file.file, format=format_container) as in_container:
            in_stream = next(
                (s for s in in_container.streams if s.type == 'video'), None)
            if not in_stream:
                raise HTTPException(
                    status_code=500, detail="Video stream not found in file")
            in_stream.thread_type = "FRAME"

            fps = in_stream.base_rate
            if (in_stream.width > in_stream.height):
                width = 640
                height = int(in_stream.height / (in_stream.width / width))
            else:
                height = 480
                width = int(in_stream.width / (in_stream.height / height))

            out_container = av.open(file_path_video, 'w')
            out_stream = out_container.add_stream(
                in_stream.codec_context.name, rate=fps)
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

                    results = person_with_gun_model(image)

                    img_array = results[0].plot()

                    # TODO: Add classification model
                    sus_res = len(results[0].boxes.cls) > 0
                    if (sus_res and (sus_i == -1)):
                        sus_i = frame.index + timeout
                        logger.info(
                            "Suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuus")
                        # cv2.imwrite(dir_path_image +
                        #             str(frame.index) + ".jpg", img_array)
                        images.append({"image": base64.b64encode(cv2.imencode(
                            '.jpg', img_array)[1].tobytes()).decode(), "sus": 1, "box": results[0].boxes.xyxy.numpy().tolist()})

                    if (sus_i == frame.index):
                        sus_i = -1

                    frame = av.VideoFrame.from_ndarray(
                        img_array, format='bgr24')
                    for packet in out_stream.encode(frame):
                        out_container.mux(packet)

            for packet in out_stream.encode():
                out_container.mux(packet)

            out_container.close()

        return {"status": "ok"}
    except Exception as e:
        logger.info(e.args)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def get_detect_video():
    global tmp_file
    try:
        tmp_file = open(file_path_video, "rb")
        return StreamingResponse(tmp_file, media_type="video/mp4", status_code=200)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Can't open file")


@router.get("/image")
async def get_image_from_detect_video():
    global images
    # image_paths = [os.path.join(dir_path_image, name) for name in os.listdir(
    #     dir_path_image) if os.path.isfile(os.path.join(dir_path_image, name))]
    try:
        # images = []
        # for path in image_paths:
        #     with open(path, "rb") as file:
        #         images.append(base64.b64encode(file.read()).decode())
        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)
