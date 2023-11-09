import React, {useState, useRef} from 'react';
import MyButton from "./MyButton";

const FileUploadButton = ({...props}) => {

    const fileInput = useRef(null);

    const handleFileUpload = (event) => {
      const selectedFile = event.target.files[0];
      const url = URL.createObjectURL(selectedFile);
      // Обработка выбранного видеофайла
      console.log(selectedFile);
      props.setVideoUrl(url);
    };

    const openFilePicker = () => {
      fileInput.current.click();
    };

    return (
        <div>
          <input
              type="file"
              accept='video/*'
              style={{display: 'none'}}
              ref={fileInput}
              onChange={handleFileUpload}
          />
          <MyButton onClick={openFilePicker}>
            Добавить видео
            <svg width="30" height="30" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink">
              <rect width="50" height="50" fill="url(#pattern0)"/>
              <defs>
                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlinkHref="#image0_17_5" transform="scale(0.02)"/>
                </pattern>
                <image id="image0_17_5" width="50" height="50" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAESklEQVRoge1YS09VVxT+UGnwgeJEo2CbmChqGkFhrhVMjE2EDjqw6S9QUkdNBwoTHwMjGoxDHwNnNqnWN1y1/QVtIo2kjTSpUBo12hoRm5bLZ5Z826wcQe55cMHkrmRn37PuXt9Z39lr7b32RklKMk1CMm1bT/I8ySHGlyHZrkvrR1oSO0m+SEAgKoaxY6aI1JD8Ww6dJrk6AYbZnBWGYdXMBJELcuC7lLNaRvKisC4Um0iTXmwh8VFKImF2nwszUYj5h8UkO0j2knxZYGx/kwGJ0AyrEHkpH9tJVkaJ2Krxe8wE7SP5QYZEDKsvpg/9YcULMxFI3CW5jWRFhg5m3SoU2r2OTCUUToHEbCYQbRWOzAFbMXoBfAygCcCdDLbdWgCtALYDqAawSvoBAIMAcgAuAfgtg3c1C+8uXGKnnY1GkrdjxPctkg0p3zlfWCNwwEnBykmeIjkmnCfaIHeRrCW5UM1+t5A8ozGUzUmS81K8/43zaYgsJXlH9ranHNTiMZWdjTlkX9LNTlUaImWvGYxLWcz4LAfQDeATxX8LgJ/d/8sBbAWwUs9DAH4A8MiNaVC+1AC4DWAHgNGYfoz7n2JGTsnuAcmVTr+J5A2S+QnywnTXSda78WY7oP+7ih1ajYrvF3I86L8i+b/whkleItlJ8jjJ712lbGPanN1mhVlev4tGJKxOByMkQgIfJblkAjvLg2NuYfBkDkuXKxaRWo1/4hJ7k76yfdHdBWB8ITJmUyedEX8q7DXFIBKKuzNOd0O6ozFwOmVzzenOSfd1MYjkNL5Fz8s1E8OThNNkrUo5M0pymcZ8JuyeuETmxFzqTD5U36feltg5Wj6fxcD5RyXRXABbpLsXeUfBkoSI3xfgaqkktVOwCRh/qq+OC5SECCd5jruhepuAEfwZiwuUhMhf6sPMDKpfmwAr2ASMFZF3FCxJiDxQv179j/qCdgyoioGzFMA2AHlhmGxQ/0cxiOTU71L/UDXXAgAHYuB0AJgP4CaAxxHM3DvsJpaMNsR6bW5j2uymwvhSY/8juXGmNkSo7KZK8aBrcyVK5yRluZX9J1yJstf9d0S67pi+pCLSIGdGIkVemysabbO7rILR2hV3/rCZ2OPsGnVSzUcq42knAp3sqBK82unrVHaM8m0x3VUXTpBtKONPJPDjtaQ5WM1TojZp+bSD1U/u/2Xa9cPmNqjV6bEb0wjgog5WluA7Z+JgBeVByJcRleKF1FtLlBPh4qMn7VE3LRHo4qDLnQifqopt1S3gIrV1KgrPudUpr3DK5PIhq+ugza4yLkR6EiR2tL25DvIXdM2qYNPKGndBt0rxD11QDLgLuvsZvMve0RMu6NrFqvc9uzK12fhFvu+Hrub7HZlmDZrNBLY7EvctBy20oPva6wBWZzDdxZR+AJ8C+DUQMakEsA/A5yqvK2ap8/+a4wC+BdAFYHgW+FSSkpSkJCV5nwXAKytEf83vYg0WAAAAAElFTkSuQmCC"/>
              </defs>
            </svg>
          </MyButton>
        </div>
    );
  };


export default FileUploadButton;