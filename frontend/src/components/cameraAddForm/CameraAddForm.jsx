import React, {useMemo, useState} from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import cl from './addForm.module.css'
import useInput from "../../hooks/useInput";

const CameraAddForm = ({...props}) => {


  const url = useInput('')
  const [cameraURL, setCameraURL] = useState('')




  const [status, setStatus] = useState(true)




  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)


  function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }



  const handleTextButtonClick =  (e) => {
    e.preventDefault()
    if (isValidURL(url.value)) {
      const videoUrl = "/api/videoCamera?url=" + encodeURIComponent(url.value);
      props.setCameraList([...props.cameraList, videoUrl])
      console.log(props.cameraList)
      const updateVideoFeed = () => {
        setCameraURL(videoUrl)

      };



      setInterval(updateVideoFeed, 1000);
    } else {
      setError("Invalid URL");
      console.log(error)
    }
  };

  const clearMistakes = useMemo(() => {

    if (!props.modalStatus) {
      setError('')
    }
  },[props.modalStatus])









  return (
      <form>

        <MyInput
            {...url}
            className={cl["videoDetect-inputUrl"]}
            type="text"
        ></MyInput>

        <div className={cl.wrapper}>
          <MyButton
              className={cl["videoDetect-sendUrlButton"]}
              onClick={
            handleTextButtonClick}
          >
            Send
          </MyButton>
          {visible
              ? <h1 className={cl.errorMessage} >{error}</h1>
              : ''
          }
        </div>
        <div>
          {error && <p>{error}</p>}
        </div>



      </form>
  );
};

export default CameraAddForm;