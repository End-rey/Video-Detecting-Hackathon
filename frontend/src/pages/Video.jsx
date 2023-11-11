import React, {useState} from 'react';
import VideoNavbar from "../components/UI/navbar/VideoNavbar";
import VideoDetect from '../components/videoComponent/VideoDetect';
import VideoEvents from "../components/eventComponent/VideoEvents";


const Video = () => {
  const title = 'Решение от Врот(Т)Чипсы'
  const[dangPhotoArr, setDangPhotoArr] = useState([])
  const [videoFile, setVideoFile] = useState(null);

  const addPhoto = (photo) => {
    setDangPhotoArr(prevDangPhotoArr => [...prevDangPhotoArr,`data:image/jpeg;base64,${photo}`])
  }
  return (
      <div className='App'>

        <VideoNavbar title={title} videoFile={videoFile} setVideoFile={setVideoFile}/>

        <div style={{marginTop: '10vh'}}>
          {videoFile
              // ? <video  height='400px' width="auto" loop autoPlay muted src={videoUrl}  controls/>
              ? <VideoDetect addPhoto={addPhoto} videoFile={videoFile}/>
              : <h1> Видео пока нет...</h1>
          }
        </div>
        <VideoEvents dangPhotoArr={dangPhotoArr}/>
      </div>

  );
};

export default Video;