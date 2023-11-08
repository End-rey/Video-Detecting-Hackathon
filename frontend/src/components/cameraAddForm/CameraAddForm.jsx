import React, {useMemo, useState} from 'react';
import MyInput from "../UI/input/MyInput";
import MyButton from "../UI/button/MyButton";
import cl from './addForm.module.css'
import useInput from "../../hooks/useInput";

const CameraAddForm = ({...props}) => {


  const [inputText, setInputText] = useState('')
  const [error, setError] = useState('')

  const handleChangeText = (event) => {
    const text = event.target.value;
    setInputText(text);
  };



  function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }



  const handleTextButtonClick = async (e) => {
    e.preventDefault()
    if (isValidURL(inputText)) {
    const videoUrl = "http://localhost:8000/api/videoCamera?url=" + encodeURIComponent(inputText);


      props.setModalStatus(false)
      const updateVideoFeed = () => {

        props.setCameraUrl(videoUrl)


      };



      setInterval(updateVideoFeed, 1000);
    } else {
      setError("Invalid URL");

    }


  };



  const clearMistakes = useMemo(() => {


    if (!props.modalStatus) {
      setError('')
      setInputText('')





    }
  },[props.modalStatus])









  return (
      <div className={cl.wrapper}>
        <h1>Введите ссылку!</h1>
        <form className={cl.formStyles}>

          <MyInput
              value={inputText}
              onChange={handleChangeText}
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
          </div>
          <div>
            {error && <h4 style={{color: 'red', marginTop: '5px'}}>{error}</h4>}
          </div>



        </form>
      </div>

  );
};

export default CameraAddForm;