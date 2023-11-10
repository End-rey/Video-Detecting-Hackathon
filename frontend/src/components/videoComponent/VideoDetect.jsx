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

      if (!response.ok) {
        const data = await response.json();
        console.error("Error:", data);
        return;
      }

      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);
      setVideoSrc(videoUrl);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!videoFile) return;

    videoDetectOnServer();
  }, []);

  return <div>{videoSrc && <video controls width="640" src={videoSrc} />}</div>;
};

export default VideoDetect;
