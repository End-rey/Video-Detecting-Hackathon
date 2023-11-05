import React, {useMemo, useState} from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import cl from './addForm.module.css'

const CameraAddForm = ({add, cameraUrl, setCameraUrl, modalStatus}) => {


  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;




  const [status, setStatus] = useState(true)




  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)

  const borderStyle =  {
    border: !status ? '1px solid red' : ''
  }

  const clearMistakes = useMemo(() => {

    if (!modalStatus) {
      setError('')
      setStatus(true)
    }
  },[modalStatus])



  const checkIp = (input) => {
    if (!ipRegex.test(input)) {
      setStatus(false)
    } else {
      setStatus(true)
    }
  }




  const addNewUrl = (e) => {
    e.preventDefault()
    const newUrl = {
      ...cameraUrl
    }

    for (let object of Object.values(newUrl)) {


      if (object === '') {

        setError('Заполните все поля!')
        setVisible(true)
        return error
      }


    }
    if (!status) {

      setError('Введите корректный IP')
      setVisible(true)
      return error


    }



    setError('')
    setVisible(false)
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

            autoComplete="off"
            required

            value={cameraUrl.login}
            onChange={e => setCameraUrl({...cameraUrl, login: e.target.value})}
            type='text'
            placeholder='Введите логин'
        />
        <MyInput

            autoComplete="off"
            required

            value={cameraUrl.password}
            onChange={e =>
                setCameraUrl({...cameraUrl, password: e.target.value})

            }
            type='text'
            placeholder='Введите пароль'
        />
        <MyInput

            autoComplete="off"
            required

            value={cameraUrl.IP}
            onChange={e => {
              setCameraUrl({...cameraUrl, IP: e.target.value})
              checkIp(e.target.value)

            }
            }
            style={borderStyle}
            type='text'
            placeholder='Введите IP'
        />
        <MyInput

            autoComplete="off"
            required

            value={cameraUrl.port}
            onChange={e => setCameraUrl({...cameraUrl, port: e.target.value})}
            type='number'
            placeholder='Введите port'
        />
        <MyInput
            autoComplete="off"
            required

            value={cameraUrl.channelNo}
            onChange={e => setCameraUrl({...cameraUrl, channelNo: e.target.value})}
            type='number'
            placeholder='Введите номер канала'
        />
        <MyInput
            autoComplete="off"
            required

            value={cameraUrl.typeNo}
            onChange={e => setCameraUrl({...cameraUrl, typeNo: e.target.value})}
            type='number'
            placeholder='Введите номер потока'
        />
        <div className={cl.wrapper}>
          <MyButton type="button" onClick={addNewUrl}>
            Добавить камеру
          </MyButton>
          {visible
              ? <h1 className={cl.errorMessage} >{error}</h1>
              : ''
          }
        </div>


      </form>
  );
};

export default CameraAddForm;