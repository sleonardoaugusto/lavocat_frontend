import axios from 'axios'
import AttendanceService from './attendance'
import useModal from '@/hooks/useModal'
import Qs from 'qs'

const BASE_URL = process.env.VUE_APP_SERVICE_URL
const httpClient = axios.create({
  baseURL: BASE_URL,
  paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'repeat' })
})

const modal = useModal()

httpClient.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    modal.open({
      component: 'SnackBar',
      props: { type: 'error', text: 'Erro no servidor.' }
    })
    return Promise.reject(error)
  }
)

export default {
  attendance: AttendanceService(httpClient)
}
