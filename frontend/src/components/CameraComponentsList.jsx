import React from 'react';
import CameraComponent from "./CameraComponent";

const CameraComponentsList = ({cameraUrls}) => {
  return (
      <div className="video__wrapper">
        <h1 className="camera_list_name">Список камер</h1>
        <div className="camera-grid">
          {cameraUrls.map((url, index) => (
              <CameraComponent key={index} cameraUrl={url}/>
          ))}
        </div>
      </div>
  );
};

export default CameraComponentsList;