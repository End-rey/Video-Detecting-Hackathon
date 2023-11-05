import React from 'react';

const CameraComponent = ({cameraUrl}) => {

    return (
        <div className="camera-container">
          <iframe
              src={cameraUrl}
              title="Camera Feed"
              width="100%"
              height="100%"
              allowFullScreen

          ></iframe>
        </div>
    );


};

export default CameraComponent;