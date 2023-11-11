import React from 'react';
import cl from "./Navbar.module.css";
import {Link} from "react-router-dom";
import FileUploadButton from "../button/FileUploadButton";
import Navbar from "./Navbar";
import ChangeThemeButton from "../button/ChangeThemeButton";

const VideoNavbar = ({...props}) => {
  return (
     <Navbar>
        <div className={cl.navbar_left}>
          <h1>{props.title}</h1>
          <Link className={cl.links} to='/'>Видео</Link>
          <Link className={cl.links} to='/camera'>Камеры</Link>
        </div>
        <div className={cl.navbar_right}>


          <FileUploadButton videoFile={props.videoFile} setVideoFile={props.setVideoFile}/>
          <ChangeThemeButton/>
        </div>
      </Navbar>

)
  ;
};

export default VideoNavbar;