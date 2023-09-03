import axios from 'axios'
import AttendanceService from './attendance'
import AttendanceFileService from './attendance-file'
import AuthService from './auth'
import Qs from 'qs'
import { Auth } from '@/utils/auth'
import useModal from '@/hooks/useModal'

const modal = useModal()

const token = localStorage.getItem('token') || undefined

const BASE_URL = process.env.VUE_APP_SERVICE_URL
const httpClient = axios.create({
  baseURL: BASE_URL,
  paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'repeat' }),
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

httpClient.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response.status === 401) {
      Auth.logout(error)
    } else if (error.response.status === 400) {
      modal.open({
        component: 'SnackBar',
        props: { type: 'error', text: 'Erro no servidor' },
      })
    }
    return Promise.reject(error)
  },
)

const keepAlive = () => {
  const NINE_MINUTES = 9 * 60000
  setInterval(() => httpClient.get('/'), NINE_MINUTES)
}

export default {
  attendance: AttendanceService(httpClient),
  attendanceFile: AttendanceFileService(httpClient),
  auth: AuthService(httpClient),
  keepAlive,
}
