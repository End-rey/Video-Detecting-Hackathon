import React, {useState} from 'react';
import VideoNavbar from "../components/UI/navbar/VideoNavbar";
import VideoDetect from '../components/videoComponent/VideoDetect';


const Video = () => {
  const title = 'Решение от Врот(Т)Чипсы'

  const [videoFile, setVideoFile] = useState(null);
  return (
      <div className='App'>

        <VideoNavbar title={title} videoFile={videoFile} setVideoFile={setVideoFile}/>

        <div style={{marginTop: '10vh'}}>
          {videoFile
              // ? <video  height='400px' width="auto" loop autoPlay muted src={videoUrl}  controls/>
              ? <VideoDetect videoFile={videoFile}/>
              : <h1> Видео пока нет...</h1>
          }
        </div>

      </div>

  );
};

export default Video;