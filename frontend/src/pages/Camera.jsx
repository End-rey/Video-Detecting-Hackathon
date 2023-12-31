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
import { v4 as uuidv4 } from 'uuid';


import CameraDetect from "../components/CameraDetect/CameraDetect";
import CameraNavbar from "../components/UI/navbar/CameraNavbar";
import CameraEvents from "../components/eventComponent/CameraEvents";




function Camera() {
  const title = 'Решение от Врот(Т)Чипсы'
  const [ping, setPing] = useState(null);
  const [dangPhotoArr, setDangPhotoArr] = useState([])
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


  const addPhoto = (photo) => {
    setDangPhotoArr(prevDangPhotoArr => [...prevDangPhotoArr, {'id': uuidv4(), 'box': photo.box,  'image': `data:image/jpeg;base64,${photo.image}`}]);
  }






  return (
      <div className="App">

        <CameraNavbar title={title} changeModalStatus={changeModalStatus}/>

        {cameraUrl !== null
            //  ? <CameraComponentsList cameraUrls={cameraUrl}/>
            ? (<CameraDetect  setPhotoArr={setDangPhotoArr} addPhoto={addPhoto} cameraUrl={cameraUrl} setCameraUrl={setCameraUrl}/>)
            : <h1 style={{marginTop:'10vh'}}>Камеры пока нет...</h1>
        }

        <CameraEvents setDangPhotoArr={setDangPhotoArr} dangPhotoArray={dangPhotoArr}/>


        <MyModal visible={modal} setVisible={setModal}>
          <CameraAddForm cameraUrl={cameraUrl} setCameraUrl={setCameraUrl} modalStatus={modal} setModalStatus={setModal}></CameraAddForm>
          {/* <VideoDetect url={cameraUrl} setModalStatus={setModal} setCameraUrl={setCameraUrl}/> */}
        </MyModal>

      </div>
  );
}

export default Camera;
