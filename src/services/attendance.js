import useModal from '@/hooks/useModal'
import AttendanceFileService from '@/services/attendance-file'

const modal = useModal()

class Attendance {
  constructor(http) {
    this.http = http
    this.attendanceFileService = AttendanceFileService(http)
  }
  createAttendance(data) {
    const { files } = data

    return this.http
      .post('/attendances/', data)
      .then(resp => {
        modal.open({
          component: 'SnackBar',
          props: { type: 'success', text: 'Atendimento cadastrado!' },
        })
        this.attendanceFileService.uploadAttendanceFiles(resp.data.id, files)
        return resp.data
      })
      .catch(err => {
        modal.open({
          component: 'SnackBar',
          props: { type: 'error', text: 'Erro ao criar atendimento' },
        })
        throw new Error(err)
      })
  }
  async updateAttendance(attendanceId, data) {
    const { files } = data

    const resp = await this.http.put(`/attendances/${attendanceId}/`, data)
    await this.attendanceFileService.uploadAttendanceFiles(attendanceId, files)

    modal.open({
      component: 'SnackBar',
      props: { type: 'success', text: 'Atendimento salvo!' },
    })

    return resp.data
  }
  async getAttendances(params = {}) {
    return await this.http
      .get('/attendances/', { params })
      .then(resp => resp.data)
  }
  async getStatuses() {
    return await this.http.get('/attendance-statuses/').then(resp => resp.data)
  }
  async getAttendanceById(attendanceId) {
    return await this.http
      .get(`/attendances/${attendanceId}/`)
      .then(resp => resp.data)
  }
  async deleteAttendance(attendanceId) {
    return await this.http
      .delete(`/attendances/${attendanceId}/`)
      .then(() => {
        modal.open({
          component: 'SnackBar',
          props: { type: 'success', text: 'Atendimento deletado.' },
        })
      })
      .catch(e => {
        console.error(`Ocorreu um erro ${e}`)
      })
  }
}

const factory = httpClient => new Attendance(httpClient)

export default factory
