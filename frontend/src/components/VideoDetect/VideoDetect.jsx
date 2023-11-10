import React, {useEffect, useState} from "react";
import cl from "./VideoDetect.module.css";
import Loader from "../UI/loader/Loader";

const VideoDetect = ({cameraUrl, setCameraUrl}) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // setError(null);
    console.log(cameraUrl);
    if (!isValidURL(cameraUrl)) {
      // setError("Invalid URL");
      return 0;
    }

    if (ws !== null) {
      console.log(ws);
      console.log("ws есть уже, давай захлопывай");
      ws.close();
    }

    const socket = new WebSocket("ws://localhost:8000/api/videoCamera");
    setWs(socket);

    socket.onopen = () => {
      setIsLoading(true)
      socket.send(cameraUrl);
      console.log("[open] Соединение установлено");

    };

    socket.onmessage = (message) => {

      setIsLoading(false)
      const imageData = message.data

      setIsLoading(false)
      console.log(`[message] Данные получены с сервера`);



      setVideoUrl(`data:image/jpeg;base64,${imageData}`);
    };

    socket.onclose = function (event) {
      setIsLoading(false)

      setError('Невозможно установить соединение!')
      if (event.wasClean) {
        console.log(
            `[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
        );
      } else {
        console.log("[close] Соединение прервано: ", event);
      }
    };

    socket.onerror = (error) => {
      console.log(error.message);
      setIsLoading(false)
      setError('Невозможно установить соединение!')

      // setError(error);
    };

    return () => socket.close()
  }, []);

  return (

      <div className={cl["videoDetect"]}>
        {isLoading
            ? <Loader/>
            : (error !== ''
                ? (
                    <div>
                      <h1 style={{color: 'red' ,alignSelf:'center'}}>{error}</h1>
                      <button
                          className={cl["videoDetect-Button"]}
                          onClick={() => {
                            ws.close();
                            setVideoUrl(null);
                            setCameraUrl(null);
                          }}
                      >
                        Close
                      </button>
                    </div>
                )
                : (videoUrl &&  <div className={cl["videoDetect-cameraDiv"]}>
                      <button
                          className={cl["videoDetect-Button"]}
                          onClick={() => {
                            ws.close();
                            setVideoUrl(null);
                            setCameraUrl(null);
                          }}
                      >
                        Close
                      </button>
                      <img
                          className={cl["videoDetect-video"]}
                          src={videoUrl}
                          alt="Live Video Feed"
                      />
                    </div> )

                )





        }


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
