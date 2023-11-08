import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import Video from "./pages/Video";
import Camera from "./pages/Camera";
import Error from './pages/Error'
const App = () => {

  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Video/>}/>
          <Route path='/camera' element={<Camera/>}/>
          <Route path='/error' element={<Error/>}/>
          <Route path='/*' element={<Navigate to='/' replace />}/>
        </Routes>
      </BrowserRouter>


  );
};

export default App;