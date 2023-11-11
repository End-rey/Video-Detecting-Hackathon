import React, {useState} from 'react';
import cl from './Events.module.css'

const Events = ({...props}) => {

  return (
      <div className={cl.gridContainer}>
        {props.dangPhotoArray.map((photo) =>
            <div key={photo.id} className={cl.gridItem}>
              <img className={cl.img}  src={photo.image} alt='Фото с оружием'/>
              <div className={cl.buttonContainer}>
                <button className={cl.yesButton}>Да</button>
                <button className={cl.noButton}>Нет</button>
              </div>
            </div>


        )}
      </div>

  );
};

export default Events;