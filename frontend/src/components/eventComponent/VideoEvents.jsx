import React, {useState} from 'react';
import cl from './Events.module.css'

const VideoEvents = ({...props}) => {

  const sendDataIfTrue = async (photo) => {
    let response = await fetch('http://localhost:8000/api/train', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify( {
        'resOfPerson': 0,
        'box': photo.box[0]
      })
    })
    if(response.ok) {
      console.log(response.status)
    }
    props.setDangPhotoArr(props.dangPhotoArr.filter(ph => ph.id !== photo.id))

  }

  const sendDataIfTFalse = async (photo) => {
    let response = await fetch('http://localhost:8000/api/train', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify( {
        'resOfPerson': 1,
        'box': photo.box[0]
      })
    })
    if(response.ok) {
      console.log(response.status)
    }
    props.setDangPhotoArr(props.dangPhotoArr.filter(ph => ph.id !== photo.id))
  }

  return (
      <div className={cl.gridContainer}>
        {props.dangPhotoArr.map((photo) =>
            <div key={photo.id} className={cl.gridItem}>
              <img className={cl.img}  src={photo.image} alt='Фото с оружием'/>
              <div className={cl.buttonContainer}>
                <button onClick={() => sendDataIfTrue(photo)} className={cl.yesButton}>Да</button>
                <button onClick={() => sendDataIfTFalse(photo)} className={cl.noButton}>Нет</button>
              </div>
            </div>


        )}
      </div>

  );
};

export default VideoEvents;