import React, {useState} from 'react';
import VideoNavbar from "../components/UI/navbar/VideoNavbar";
import VideoDetect from '../components/videoComponent/VideoDetect';
import VideoEvents from "../components/eventComponent/VideoEvents";
import { v4 as uuidv4 } from 'uuid';


const Video = () => {
  const title = 'Решение от Врот(Т)Чипсы'
  const[dangPhotoArr, setDangPhotoArr] = useState([])
  const [videoFile, setVideoFile] = useState(null);

  const addPhoto = (photo) => {
    setDangPhotoArr(prevDangPhotoArr => [...prevDangPhotoArr,{'id' : uuidv4(),'box': photo.box, 'image': `data:image/jpeg;base64,${photo.image}`}])
  }
  return (
      <div className='App'>

        <VideoNavbar title={title} videoFile={videoFile} setVideoFile={setVideoFile}/>

        <div style={{marginTop: '10vh'}}>
          {videoFile
              // ? <video  height='400px' width="auto" loop autoPlay muted src={videoUrl}  controls/>
              ? <VideoDetect addPhoto={addPhoto} videoFile={videoFile} setDangPhotoArr={setDangPhotoArr}/>
              : <h1> Видео пока нет...</h1>
          }
        </div>
        <VideoEvents setDangPhotoArr={setDangPhotoArr} dangPhotoArr={dangPhotoArr}/>
      </div>

  );
};

export default Video;