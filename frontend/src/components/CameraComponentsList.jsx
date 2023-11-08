import React from 'react';
import CameraComponent from "./CameraComponent/CameraComponent";

const CameraComponentsList = ({cameraUrls}) => {
  return (
      <div className="video__wrapper">
        <h1 className="camera_list_name">Список камер</h1>
        <div className="camera-grid">

              <CameraComponent  cameraUrl={cameraUrls}/>

        </div>
      </div>
  );
};

export default CameraComponentsList;