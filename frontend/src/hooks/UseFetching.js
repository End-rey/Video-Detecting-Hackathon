import {useJsonParse} from "./useParseJson";
import {useEffect, useState} from "react";


export const useFetching = async () => {
  const {jsonString, setJsonString} = useState(null)
  const response = await fetch('')
  const data = await response.json()
  setJsonString(data)
  return {jsonString}
}