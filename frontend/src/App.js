import React, {useMemo, useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Camera from "./pages/Camera";
import Video from "./pages/Video";
import Navbar from "./components/UI/navbar/Navbar";



function App(){

  return (
      <BrowserRouter>


        <Routes>
          <Route path='camera' element={<Camera/>}/>
          <Route path='video' element={<Video/>}/>
        </Routes>

      </BrowserRouter>
  )
}

export default App;
