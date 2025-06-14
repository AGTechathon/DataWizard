import axios from "axios"

export const getToken=async()=>{
    const result = await axios.get('/api/apiToken');
   
    return result.data;
}