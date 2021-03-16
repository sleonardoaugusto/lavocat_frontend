import axios from 'axios'
import AttendanceService from './attendance'
import useModal from '@/hooks/useModal'

const BASE_URL = process.env.VUE_APP_SERVICE_URL
const httpClient = axios.create({
  baseURL: BASE_URL
})

const modal = useModal()

httpClient.interceptors.response.use(function(response) {
  modal.open({ component: 'SnackBar', props: { type: 'success', text: 'Operação concluída!' } })
  return response
}, function(error) {
  modal.open({ component: 'SnackBar', props: { type: 'error', text: 'Ocorreu algum erro' } })
  return Promise.reject(error)
})

export default {
  attendance: AttendanceService(httpClient)
}
