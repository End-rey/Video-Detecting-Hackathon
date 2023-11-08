import React from 'react';
import cl from "./CameraComponent.module.css";

const CameraComponent = ({cameraUrl}) => {
  const check = async () => {
    console.log(cameraUrl)
  }

  setInterval(check,1000)
    return (
        <div>
          <div className={cl.videoDetectCamera}>
            {cameraUrl && <img className={cl.videoDetectVideo} src={cameraUrl} alt="Live Video Feed"/>}
          </div>
        </div>
    );


};

export default CameraComponent;