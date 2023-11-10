import { React, useState } from "react";
import "../styles/App.css";
import Navbar from "../components/UI/navbar/Navbar";
// import CameraComponentsList from "../components/CameraComponentsList";
import MyModal from "../components/modal/MyModal";
import CameraAddForm from "../components/cameraAddForm/CameraAddForm";
import NoCamera from "../components/noCamera/NoCamera";
import cl from "../components/UI/navbar/Navbar.module.css";
import {Link} from "react-router-dom";
import MyButton from "../components/UI/button/MyButton";

import VideoDetect from "../components/VideoDetect/VideoDetect";




function Camera() {
  const title = 'Проект от VэЧипZи'
  const [ping, setPing] = useState(null);

  const [modal, setModal] = useState(false)
  const [cameraList, setCameraList] = useState([
    //'http://webcam.anapa-official.ru:9999/player/?key=q1322qefasfrttg&cam=efb90850-93df-4bbb-ac51-9663342ee5b4',
    // 'http://webcam.anapa-official.ru:9999/player/?key=q1322qefasfrttg&cam=965aa513-a27d-4078-92b4-3ff104bc0622',
    // 'https://rtsp.me/embed/i93R6hin/?'
  ])
  const [cameraUrl, setCameraUrl] = useState(null)


  const changeModalStatus = (modal) => {
    setModal(true)
  }



  function pingServer() {
    fetch("http://localhost:8000/api/ping")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Ошибка сети");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          setPing(data.ping);
        })
        .catch((error) => {
          console.error("Ошибка:", error);
        });
  }



  return (
      <div className="App">
        <Navbar>
          <div className={cl.navbar_left}>
            <img width='40 px' height='auto' src='https://www.anapa-official.ru/simai.data/image/logo/Coat_of_Arms_of_Anapa_(Krasnodar_krai).svg%20copy.png' alt=''/>
            <h1>{title}</h1>
          </div>
          <div className={cl.navbar_right}>
            <Link to='/'>Видео</Link>
            <Link to='/camera'>Камеры</Link>
            <MyButton onClick={() => changeModalStatus()}>Добавить камеру</MyButton>
            <MyButton>
              Сменить тему
            </MyButton>
          </div>
        </Navbar> 
        {cameraUrl !== null
            //  ? <CameraComponentsList cameraUrls={cameraUrl}/>
            ? (<VideoDetect cameraUrl={cameraUrl} setCameraUrl={setCameraUrl}/>)
            : (<NoCamera/>)
        }

        <button onClick={pingServer}>Ping</button>

        {ping && <p>{ping}</p>}



        <MyModal visible={modal} setVisible={setModal}>
          <CameraAddForm cameraUrl={cameraUrl} setCameraUrl={setCameraUrl} modalStatus={modal} setModalStatus={setModal} setCameraList={setCameraList}></CameraAddForm>
          {/* <VideoDetect url={cameraUrl} setModalStatus={setModal} setCameraUrl={setCameraUrl}/> */}
        </MyModal>

      </div>
  );
}

export default Camera;
