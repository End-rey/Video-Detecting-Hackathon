import React from 'react';
import cl from './noCamera.module.css'
const NoCamera = () => {
  return (
      <div className={cl.container}>
        <h1 className={cl.name}>Камер пока нет!</h1>
      </div>
  );
};

export default NoCamera;