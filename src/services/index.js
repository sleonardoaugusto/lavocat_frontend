import axios from 'axios'
import AttendanceService from './attendance'
import useModal from '@/hooks/useModal'

const BASE_URL = process.env.VUE_APP_SERVICE_URL
const httpClient = axios.create({
  baseURL: BASE_URL
})

httpClient.interceptors.response.use(function(response) {
  return response
}, function(error) {
  const modal = useModal()
  modal.open({ component: 'SnackBar', props: { type: 'error', text: 'Erro no servidor' } })
  return Promise.reject(error)
})

export default {
  auth: AttendanceService(httpClient)
}
