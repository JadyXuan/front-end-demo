import axios from 'axios'

const API_URL = 'http://' + location.host
// const API_URL = 'http://127.0.0.1'
export function getStatus () {
  return axios.get(`${API_URL}/api/status`)
    .then(response => response.data)
    .catch(error => {
      throw error
    })
}
