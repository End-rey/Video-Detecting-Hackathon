import React, {useState} from 'react';
import Navbar from "../components/UI/navbar/Navbar";
import AddVideo from "../components/videoAddForm/AddVideo";
import MyModal from "../components/modal/MyModal";
import MyButton from "../components/UI/button/MyButton";
import cl from "../components/UI/navbar/Navbar.module.css";
import {Link} from "react-router-dom";


const Video = () => {


  const title = 'Проект от VэЧипZи'
  const changeModalStatus = (modal) => {
    setModal(true)
  }
  const [videoUrl, setVideoUrl] = useState('')
  const [modal, setModal] = useState(false)
  return (
      <div className='App'>
        <Navbar>
          <div className={cl.navbar_left}>
            <img width='40 px' height='auto'
                 src='https://www.anapa-official.ru/simai.data/image/logo/Coat_of_Arms_of_Anapa_(Krasnodar_krai).svg%20copy.png'
                 alt=''/>
            <h1>{title}</h1>
          </div>
          <div className={cl.navbar_right}>
            <Link to='/'>Видео</Link>
            <Link to='/camera'>Камеры</Link>
            <MyButton onClick={() => changeModalStatus()}>Добавить видео</MyButton>
            <MyButton>
              Сменить тему
            </MyButton>
          </div>
        </Navbar>
        <MyModal visible={modal} setVisible={setModal}>
          <AddVideo modalStatus={modal} setModalStatus={setModal} videoUrl={videoUrl} setVideoUrl={setVideoUrl}/>
        </MyModal>
        <div style={{marginTop: '10vh'}}>
          {videoUrl
              ? <video  height='auto' loop autoPlay muted src={videoUrl} width="400" controls/>
              : <h1> Видео пока нет!</h1>
          }
        </div>

      </div>

  );
};

export default Video;