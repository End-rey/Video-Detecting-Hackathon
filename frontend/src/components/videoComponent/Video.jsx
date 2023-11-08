import React from 'react';

const Video = (...props) => {
  return (
      <div>
        {props.videoUrl && <video style={{alignSelf:"center"}} autoPlay muted src={props.videoUrl} width="400" controls/>}
      </div>
  );
};

export default Video;