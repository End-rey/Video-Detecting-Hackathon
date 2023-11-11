import React, { useEffect, useState } from "react";

const VideoDetect = ({ videoFile, setVideoFile }) => {
  const [videoSrc, setVideoSrc] = useState(null);

  const videoDetectOnServer = async () => {
    const formData = new FormData();
    formData.append("file", videoFile);

    console.log("Send video to server");

    try {
      const response = await fetch("http://localhost:8000/api/video", {
        method: "POST",
        body: formData,
      });

      console.log(response);

      if (!response.ok) {
        console.log("error in response");
        return;
      }

      setVideoSrc("http://localhost:8000/api/video");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!videoFile) return;

    videoDetectOnServer();
  }, []);

  return <div>{videoSrc && <video controls src={videoSrc} />}</div>;
};

export default VideoDetect;
