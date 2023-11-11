import React, {useEffect, useMemo, useState} from "react";
import cl from "./CameraDetect.module.css";
import Loader from "../UI/loader/Loader";
import MyButton from "../UI/button/MyButton";
import {useFetching} from "../../hooks/UseFetching";
import {useJsonParse} from "../../hooks/useParseJson";

const CameraDetect = ({ cameraUrl, setCameraUrl }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('');
  const [ws, setWs] = useState(null);
  const [fetchStatus, setFetchStatus] = useState(false)


      const jsonData = useFetching()
      const parsePhotoData = useJsonParse(jsonData).photo




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

    const socket = new WebSocket("ws://localhost:8000/api/camera");
    setWs(socket);

    socket.onopen = () => {
      setIsLoading(true)
      socket.send(cameraUrl);
      console.log("[open] Соединение установлено");

    };

    socket.onmessage = (message) => {
      setFetchStatus(true)
      setIsLoading(false)
      const imageData = parsePhotoData
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

    return () => socket.close();
  }, []);

  return (

      <div className={cl["videoDetect"]}>
        {isLoading
            ? <Loader/>
            : (error !== ''
                ? (
                    <div className={cl.wrapper}>
                      <h1 style={{color: 'red' ,verticalAlign:'center'}}>{error}</h1>
                      <MyButton style={{marginTop: '15px'}}

                          onClick={() => {
                            ws.close();
                            setVideoUrl(null);
                            setCameraUrl(null);
                          }}
                      >
                        Закрыть
                      </MyButton>
                    </div>
                )
                : (videoUrl &&  <div className={cl["videoDetect-cameraDiv"]}>
                      <div className={cl.wrapper}>
                        <img
                            className={cl["videoDetect-video"]}
                            src={videoUrl}
                            alt="Live Video Feed"
                        />
                        <MyButton style={{marginTop: '15px'}}

                            onClick={() => {
                              ws.close();
                              setVideoUrl(null);
                              setCameraUrl(null);
                            }}
                        >
                          Закрыть
                        </MyButton>
                      </div>

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

export default CameraDetect;
