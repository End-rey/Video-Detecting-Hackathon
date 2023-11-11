import React, {useEffect, useMemo, useState} from "react";
import cl from "./CameraDetect.module.css";
import Loader from "../UI/loader/Loader";
import MyButton from "../UI/button/MyButton";
import {useFetching} from "../../hooks/UseFetching";
import {useJsonParse} from "../../hooks/useParseJson";

const CameraDetect = ({...props}) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('');
  const [ws, setWs] = useState(null);







  useEffect(() => {
    // setError(null);
    console.log(props.cameraUrl);
    if (!isValidURL(props.cameraUrl)) {
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
      socket.send(props.cameraUrl);
      console.log("[open] Соединение установлено");

    };

    socket.onmessage = (message) => {
      setIsLoading(false)
      const responseData = JSON.parse(message.data)
      console.log(`[message] Данные получены с сервера`);

      if(responseData.sus) {
        props.addPhoto(responseData)
      }

      setVideoUrl(`data:image/jpeg;base64,${responseData.image}`);

    };

    socket.onclose = function (event) {
      props.setPhotoArr([])
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

      <div className={cl["cameraDetect"]}>
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
                            props.setCameraUrl(null);
                          }}
                      >
                        Закрыть
                      </MyButton>
                    </div>
                )
                : (videoUrl &&  <div className={cl["cameraDetect-cameraDiv"]}>
                      <div className={cl.wrapper}>
                        <img
                            className={cl["cameraDetect-video"]}
                            src={videoUrl}
                            alt="Live Video Feed"
                        />
                        <MyButton style={{marginTop: '15px'}}

                            onClick={() => {
                              ws.close();
                              setVideoUrl(null);
                              props.setCameraUrl(null);
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
