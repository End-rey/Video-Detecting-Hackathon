import React, {useState} from 'react';
import Navbar from "../components/UI/navbar/Navbar";
import AddVideo from "../components/videoAddForm/AddVideo";
import MyModal from "../components/modal/MyModal";
import MyButton from "../components/UI/button/MyButton";
import cl from "../components/UI/navbar/Navbar.module.css";
import {Link} from "react-router-dom";
import FileUploadButton from "../components/UI/button/FileUploadButton";
import VideoNavbar from "../components/UI/navbar/VideoNavbar";
import {useTheme} from "../hooks/useTheme";


const Video = () => {




  const title = 'Решение от Врот(Т)Чипсы'
  const changeModalStatus = (modal) => {
    setModal(true)
  }
  const [videoUrl, setVideoUrl] = useState('')
  const [modal, setModal] = useState(false)
  return (
      <div className='App'>

        <VideoNavbar title={title} videoUrl={videoUrl} setVideoUrl={setVideoUrl}/>

        <MyModal visible={modal} setVisible={setModal}>
          <AddVideo modalStatus={modal} setModalStatus={setModal} videoUrl={videoUrl} setVideoUrl={setVideoUrl}/>
        </MyModal>
        <div style={{marginTop: '10vh'}}>
          {videoUrl
              ? <video  height='400px' width="auto" loop autoPlay muted src={videoUrl}  controls/>
              : <h1> Видео пока нет...</h1>
          }
        </div>

      </div>

  );
};

export default Video;