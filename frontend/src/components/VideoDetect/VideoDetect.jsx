import React, { useState} from "react";
import cl from "./VideoDetect.module.css";

const VideoDetect = () => {
  const [cameraUrl, setCameraUrl] = useState("");
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(null);

  const handleChangeText = (event) => {
    const text = event.target.value;
    setInputText(text);
  };

  const handleTextButtonClick = async () => {
    if (isValidURL(inputText)) {
        const videoUrl = "http://localhost:8000/api/videoCamera?url=" + encodeURIComponent(inputText);

        const updateVideoFeed = () => {
          setCameraUrl(videoUrl);
        };

        setInterval(updateVideoFeed, 100);
    } else {
      setError("Invalid URL");
    }
  };

  return (
    <div className={cl["videoDetect"]}>
      <div>
        <input
          className={cl["videoDetect-inputUrl"]}
          type="text"
          onChange={handleChangeText}
        ></input>
        <button
          className={cl["videoDetect-sendUrlButton"]}
          onClick={handleTextButtonClick}
        >
          Send
        </button>
      </div>
      {error && <p>{error}</p>}
      <div className={cl["videoDetect-camera"]}>
        {cameraUrl && <img className={cl['videoDetect-video']} src={cameraUrl} alt="Live Video Feed"/>}
      </div>
    </div>
  );
};

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export default VideoDetect;
