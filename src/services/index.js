import axios from 'axios'
import AttendanceService from './attendance'
import useModal from '@/hooks/useModal'

const BASE_URL = process.env.VUE_APP_SERVICE_URL
const httpClient = axios.create({
  baseURL: BASE_URL
})

const modal = useModal()

httpClient.interceptors.response.use(function(response) {
  return response
}, function(error) {
  modal.open({ component: 'SnackBar', props: { text: 'Erro no servidor' } })
  return Promise.reject(error)
})

export default {
  auth: AttendanceService(httpClient)
}
