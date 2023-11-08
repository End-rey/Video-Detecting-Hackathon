import React, { useState, useEffect } from 'react';

const ImageStream = ({inputText}) => {
  const [socket, setSocket] = useState(null);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    console.log(inputText);
    const videoUrl =
      "ws://localhost:8000/api/videoCamera?url=" +
      encodeURIComponent(inputText);
    // Установка соединения с веб-сокетом при монтировании компонента
    const ws = new WebSocket(videoUrl);

    ws.onopen = () => {
      console.log('Соединение установлено');
    };

    ws.onmessage = (event) => {
      // Обработка полученных данных, которые могут быть байтами изображения
      setImageData(event.data);
    };

    ws.onclose = () => {
      console.log('Соединение закрыто');
    };

    setSocket(ws);

    // Закрытие соединения при размонтировании компонента
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket, inputText]);

  return (
    <div>
      {imageData && <img src={`data:image/jpeg;base64,${btoa(imageData)}`} alt="res" />}
    </div>
  );
}

export default ImageStream;
