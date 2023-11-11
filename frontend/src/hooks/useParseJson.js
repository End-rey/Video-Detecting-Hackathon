import {useEffect, useState} from "react";


export const useJsonParse = ({jsonString}) => {
  const [photo, setPhoto] = useState([])
  const [flag, setFlag] = useState(false)

  useEffect(() => {

    if(jsonString) {
      try {
        const {photo: parsedPhoto, flag: parsedFlag} = JSON.parse(jsonString)
        setPhoto(parsedPhoto)
        setFlag(parsedFlag)
      } catch(e) {
        console.error(e.message)
      }
    }
  }, [jsonString]);
  return {photo, flag}

}