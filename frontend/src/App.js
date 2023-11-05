import React, {useState} from "react";
import './styles/App.css'
import Navbar from "./components/UI/navbar/Navbar";

import CameraComponentsList from "./components/CameraComponentsList";
import MyButton from "./components/UI/button/MyButton";
import MyModal from "./components/modal/MyModal";
import CameraAddForm from "./components/cameraAddForm/CameraAddForm";


function App() {
  const [ping, setPing] = useState(null)

  const [modal,setModal] = useState(false)
  const [cameraList, setCameraList] = useState([
    'http://webcam.anapa-official.ru:9999/player/?key=q1322qefasfrttg&cam=efb90850-93df-4bbb-ac51-9663342ee5b4',
    'http://webcam.anapa-official.ru:9999/player/?key=q1322qefasfrttg&cam=965aa513-a27d-4078-92b4-3ff104bc0622',
    'https://rtsp.me/embed/i93R6hin/?'
  ])
  const [cameraUrl, setCameraUrl] = useState({
    login: '',
    password: '',
    IP: '',
    port: '',
    channelNo: '',
    typeNo: ''
  })
  const addUrl = (newUrl) => {
    setCameraList([...cameraList,
      `rtsp://${newUrl.login}:${newUrl.password}@${newUrl.IP}:${newUrl.port}/cam/realmonitor?channel=${newUrl.channelNo}&subtype=${newUrl.typeNo}`
    ])
    setModal(false)
    console.log(newUrl)
  }



  const changeModalStatus = (modal) => {
    setModal(true)
  }

  const cleanInput = () => {
    console.log('working')

      setCameraUrl({
        login: '',
        password: '',
        IP: '',
        port: '',
        channelNo: '',
        typeNo: ''
      })


  }




  function pingServer() {
    fetch("http://localhost:8000/api/ping")
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка сети');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setPing(data.ping)
      })
      .catch(error => {
        console.error('Ошибка:', error);
      });
  }


  return (
      <div className="App">
        <Navbar changeM={changeModalStatus} title={"Муниципальное образование города-курорта Анапа"}/>

        <CameraComponentsList cameraUrls={cameraList}/>
        <button onClick={pingServer}>Ping</button>
        {ping && <p>{ping}</p>}
        <MyModal cleanInput={cleanInput} visible={modal} setVisible={setModal}>
          <CameraAddForm modalStatus={modal}  cameraUrl={cameraUrl} setCameraUrl={setCameraUrl} add={addUrl}/>
        </MyModal>

      </div>

  )
}

export default App;
