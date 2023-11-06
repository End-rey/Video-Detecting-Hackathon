import React, { useState } from 'react';
import cl from './ImageDetect.module.css'

const ImageDetect = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState("../../images/load.jpg");
    const [detectedImage, setDetectedImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
        setSelectedFile(file)
        setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDetectClick = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const detectedImageData = await response.blob();
        setDetectedImage(URL.createObjectURL(detectedImageData));
      } else {
        // Handle the error
      }
    } catch (error) {
      // Handle network or other errors
    }
  };

    return (
      <div className={cl['imageDetect']}>
        <span className={cl['imageDetect-uploadSpan']}>
            <img
                className={cl['imageDetect-previewImage']}
                src={previewImage}
                alt='upload'
            />
            <label className={cl['imageDetect-uploadFile']}>
                <input
                    type="file"
                    name="fileToUpload"
                    id="fileToUpload"
                    size="1"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </label>
        </span>
        {selectedFile && (
          <button className={cl['imageDetect-button']} onClick={handleDetectClick}>Detect</button>
        )}
        {detectedImage && (
          <div>
            <img className={cl['imageDetect-detectImage']} src={detectedImage} alt="Detected" width="200" />
          </div>
        )}
      </div>
    );
}

export default ImageDetect;