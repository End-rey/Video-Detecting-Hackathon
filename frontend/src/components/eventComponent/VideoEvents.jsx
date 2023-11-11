import React, {useState} from 'react';
import cl from './Events.module.css'

const VideoEvents = ({...props}) => {

  const sendDataIfTrue = async () => {
    await fetch('http://localhost:8000/api/train', {
      method: 'POST',
      body: {
        resOfPerson: '1',
        box: ''
      }
    })
  }

  const sendDataIfTFalse = async () => {
    await fetch('http://localhost:8000/api/train', {
      method: 'POST',
      body: {
        resOfPerson: '0',
        box: ''
      }
    })
  }


  return (
      <div className={cl.gridContainer}>
        {props.dangPhotoArr.map((photo) =>
            <div key={photo.id} className={cl.gridItem}>
              <img className={cl.img}  src={photo.image} alt='Фото с оружием'/>
              <div className={cl.buttonContainer}>
                <button onClick={sendDataIfTrue} className={cl.yesButton}>Да</button>
                <button onClick={sendDataIfTFalse} className={cl.noButton}>Нет</button>
              </div>
            </div>


        )}
      </div>

  );
};

export default VideoEvents;