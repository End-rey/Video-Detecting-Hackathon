import React, {useState} from 'react';
import cl from './AddVideo.module.css'
import MyInput from "../UI/input/MyInput";
const AddVideo = ({...props}) => {

  const [input, setInput] = useState('')
    const handleFileUpload = (event) => {
      let file = event.target.files[0];
      const url = URL.createObjectURL(file);
      console.log(url)
      props.setVideoUrl(url);
      props.setModalStatus(false)
      setInput('')

    };
    return (
        <div>
          <input value={input} type="file" onChange={handleFileUpload} accept="video/*"/>
        </div>
    )
  };


export default AddVideo;