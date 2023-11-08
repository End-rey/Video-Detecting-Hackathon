import React, { useState } from "react";
import cl from "./VideoDetect.module.css";

const VideoDetect = () => {
  const [cameraUrl, setCameraUrl] = useState("");
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(null);
  const [ws, setWs] = useState(null);

  const handleChangeText = (event) => {
    const text = event.target.value;
    setInputText(text);
  };

  const handleTextButtonClick = () => {
    setError(null);
    if (!isValidURL(inputText)) {
      console.log(inputText);
      setError("Invalid URL");
      return 0;
    }

    if (ws !== null) {
      console.log(ws);
      console.log("ws есть уже, давай захлопывай");
      ws.close();
    }

    const videoUrl = "ws://localhost:8000/api/videoCamera";

    const socket = new WebSocket(videoUrl);
    setWs(socket);

    socket.onopen = () => {
      socket.send(inputText);
      console.log("[open] Соединение установлено");
    };

    socket.onmessage = (message) => {
      console.log(`[message] Данные получены с сервера`);
      const imageData = message.data;

      setCameraUrl(`data:image/jpeg;base64,${imageData}`);
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log(
          `[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
        );
      } else {
        console.log("[close] Соединение прервано: ", event);
      }
    };

    socket.onerror = (error) => {
      console.log(error);
      setError(error);
    };
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
          className={cl["videoDetect-Button"]}
          onClick={handleTextButtonClick}
        >
          Send
        </button>
      </div>
      {error && <p>{error}</p>}
      {cameraUrl && (
        <div className={cl["videoDetect-cameraDiv"]}>
          <button
            className={cl["videoDetect-Button"]}
            onClick={() => {
              ws.close();
              setCameraUrl(null);
            }}
          >
            Close
          </button>
          <img
            className={cl["videoDetect-video"]}
            src={cameraUrl}
            alt="Live Video Feed"
          />
        </div>
      )}
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
