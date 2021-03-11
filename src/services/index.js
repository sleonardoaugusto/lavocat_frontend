import axios from 'axios'
import AttendanceService from './attendance'

const BASE_URL = process.env.VUE_APP_SERVICE_URL
const httpClient = axios.create({
  baseURL: BASE_URL
})

export default {
  auth: AttendanceService(httpClient)
}
