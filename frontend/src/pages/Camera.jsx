import React, {useMemo, useState} from "react";
import "../styles/App.css";
import Navbar from "../components/UI/navbar/Navbar";
import CameraComponentsList from "../components/CameraComponentsList";
import MyModal from "../components/modal/MyModal";
import CameraAddForm from "../components/cameraAddForm/CameraAddForm";
import NoCamera from "../components/noCamera/NoCamera";



function Camera() {
  const [ping, setPing] = useState(null);

  const [modal,setModal] = useState(false)
  const [cameraList, setCameraList] = useState([
    //'http://webcam.anapa-official.ru:9999/player/?key=q1322qefasfrttg&cam=efb90850-93df-4bbb-ac51-9663342ee5b4',
    // 'http://webcam.anapa-official.ru:9999/player/?key=q1322qefasfrttg&cam=965aa513-a27d-4078-92b4-3ff104bc0622',
    // 'https://rtsp.me/embed/i93R6hin/?'
  ])
  const [cameraUrl, setCameraUrl] = useState('')





  const changeModalStatus = (modal) => {
    setModal(true)
  }

  const cleanInput = () => {
    console.log('working')




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
        <Navbar changeM={changeModalStatus} title={"Муниципальное образование города-курорта Анапа"}/>
        {cameraUrl !== ''
            ? <CameraComponentsList cameraUrls={cameraUrl}/>
            : <NoCamera/>
        }

        <button onClick={pingServer}>Ping</button>

        {ping && <p>{ping}</p>}



        <MyModal cleanInput={cleanInput} visible={modal} setVisible={setModal}>
          <CameraAddForm cameraUrl={cameraUrl} setCameraUrl={setCameraUrl} modalStatus={modal} setModalStatus={setModal} setCameraList={setCameraList}></CameraAddForm>

        </MyModal>

      </div>
  );
}

export default Camera;