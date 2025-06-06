import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  
 return request
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export default { getAll, create, update}