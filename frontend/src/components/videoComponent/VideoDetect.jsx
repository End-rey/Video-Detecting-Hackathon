import React, {useEffect, useState} from "react";
import Loader from "../UI/loader/Loader";

const VideoDetect = ({videoFile, addPhoto}) => {
      const [videoSrc, setVideoSrc] = useState(null);
      const [isLoading, setIsLoading] = useState(false)
      const [error, setError] = useState(null)

      const videoDetectOnServer = async () => {
        const formData = new FormData();
        formData.append("file", videoFile);

        console.log("Send video to server");

        try {
          setIsLoading(true)
          const response = await fetch("http://localhost:8000/api/video", {
            method: "POST",
            body: formData,
          });
          const response_photos = await fetch('http://localhost:8000/api/video/image')
          const body = await response_photos.json()
          console.log(body)


          if (!response.ok) {
            console.log("error in response");
            return;
          }

          setVideoSrc("http://localhost:8000/api/video");
        } catch (error) {

          console.error("Error:", error);
        } finally {
          setIsLoading(false)

        }
      };

      useEffect(() => {
        if (!videoFile) return;

        videoDetectOnServer();
      }, []);

      return (
          <div>
            {isLoading
                ? <Loader/>
                :
                        <div>{videoSrc && <video controls src={videoSrc}/>}</div>


            }
          </div>


      )
    }
;

export default VideoDetect;
