import axios from 'axios'
import AttendanceService from './attendance'
import AuthService from './auth'
import Qs from 'qs'
import { Auth } from '@/utils/auth'
import router from '@/router'

const BASE_URL = process.env.VUE_APP_SERVICE_URL
const httpClient = axios.create({
  baseURL: BASE_URL,
  paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'repeat' })
})

httpClient.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response.status === 401) {
      Auth.removeToken()
      router.push({ name: 'login' })
    }
    return Promise.reject(error)
  }
)

export default {
  attendance: AttendanceService(httpClient),
  auth: AuthService(httpClient)
}
