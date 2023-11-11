import React, {useState} from 'react';
import {useJsonParse} from "../../hooks/useParseJson";

const Events = ({photo, flag}) => {
  const {photosArray, setPhotosArray} = useState([])
  if(flag) {
    setPhotosArray([...photosArray, photo])
  }
  return (
      <div>
        {photosArray.map((photo) =>
          <img key={photo.index} src={photo} alt='Фото с оружием'/>
        )}
      </div>
  );
};

export default Events;