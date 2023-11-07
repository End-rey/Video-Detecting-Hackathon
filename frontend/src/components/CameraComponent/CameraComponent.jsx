import React from 'react';
import cl from "./CameraComponent.module.css";

const CameraComponent = ({cameraUrl}) => {

    return (
        <div>
          <div className={cl["videoDetect-camera"]}>
            {cameraUrl && <img className={cl['videoDetect-video']} src={cameraUrl} alt="Live Video Feed"/>}
          </div>
        </div>
    );


};

export default CameraComponent;