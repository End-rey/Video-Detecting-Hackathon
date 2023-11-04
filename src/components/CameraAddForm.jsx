import React, {useState} from 'react';
import MyInput from "./UI/input/MyInput";
import MyButton from "./UI/button/MyButton";
import myInput from "./UI/input/MyInput";

const CameraAddForm = ({add}) => {



  const [cameraUrl, setCameraUrl] = useState({
    login: '',
    password: '',
    IP: '',
    port: '',
    channelNo: '',
    typeNo: ''
  })

  const [isValidIPv4, setIsValidIPv4] = useState(false);
  const [isValidIPv6, setIsValidIPv6] = useState(false);
  const [error, setError] = useState('')


  const addNewUrl = (e) => {
    e.preventDefault()
    const newUrl = {
      ...cameraUrl
    }

    for (let object of Object.values(newUrl)) {


      if (object === '') {

        setError('Заполните все обязательные поля!')
        return error


      }
    }


    setError('')
    add(newUrl)
    setCameraUrl({
      login: '',
      password: '',
      IP: '',
      port: '',
      channelNo: '',
      typeNo: ''
    })


  }

  return (
      <form>

        <MyInput
            required
            name='login'
            value={cameraUrl.login}
            onChange={e => setCameraUrl({...cameraUrl, login: e.target.value})}
            type='text'
            placeholder='Введите логин'
        />
        <MyInput
            required
            name='password'
            value={cameraUrl.password}
            onChange={e =>
                setCameraUrl({...cameraUrl, password: e.target.value})
            }
            type='text'
            placeholder='Введите пароль'
        />
        <MyInput
            required
            name='IP'
            value={cameraUrl.IP}
            onChange={e =>
                setCameraUrl({...cameraUrl, IP: e.target.value})


            }
            type='text'
            placeholder='Введите IP'
        />
        <MyInput
            required
            name='port'
            value={cameraUrl.port}
            onChange={e => setCameraUrl({...cameraUrl, port: e.target.value})}
            type='text'
            placeholder='Введите port'
        />
        <MyInput
            required
            name='channelNumber'
            value={cameraUrl.channelNo}
            onChange={e => setCameraUrl({...cameraUrl, channelNo: e.target.value})}
            type='text'
            placeholder='Введите номер канала'
        />
        <MyInput
            required
            name='streamNumber'
            value={cameraUrl.typeNo}
            onChange={e => setCameraUrl({...cameraUrl, typeNo: e.target.value})}
            type='text'
            placeholder='Введите номер потока'
        />
        <MyButton onClick={addNewUrl}>
          Добавить камеру
        </MyButton>
        <h1 style={{color: 'red', display: 'inline', paddingLeft: '15px'}}>{error}</h1>
      </form>
  );
};

export default CameraAddForm;