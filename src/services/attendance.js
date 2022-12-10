import useModal from '@/hooks/useModal'
import UploadFile from '@/services/providers/uploadFile'

const modal = useModal()

class Attendance {
  constructor(http) {
    this.http = http
  }
  async createAttendance(data) {
    const { files } = data

    const resp = await this.http.post('/attendances/', data)
    await this.uploadAttendanceFiles(resp.data.id, files)

    modal.open({
      component: 'SnackBar',
      props: { type: 'success', text: 'Atendimento cadastrado!' }
    })

    return resp.data
  }
  async updateAttendance(attendanceId, data) {
    const { files } = data

    const resp = await this.http.put(`/attendances/${attendanceId}/`, data)
    await this.uploadAttendanceFiles(attendanceId, files)

    modal.open({
      component: 'SnackBar',
      props: { type: 'success', text: 'Atendimento salvo!' }
    })

    return resp.data
  }
  async uploadAttendanceFiles(attendanceId, files) {
    if (files && files.length) {
      const filesParsed = []

      for (let i = 0; i < files.length; i++) {
        if (files[i] instanceof File) {
          const fd = new FormData()
          fd.append('attendance', attendanceId)
          fd.append('file', files[i])
          filesParsed.push(fd)
        }
      }

      const uploadService = new UploadFile(this.http)
      await uploadService.uploadFiles(filesParsed, 'post', '/attendance-files/')
    }
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
  async deleteAttendanceFile(attendanceFileId) {
    return await this.http
      .delete(`/attendance-files/${attendanceFileId}/`)
      .then(() => {
        modal.open({
          component: 'SnackBar',
          props: { type: 'success', text: 'Arquivo deletado.' }
        })
      })
      .catch(e => {
        console.error(`Ocorreu um erro ${e}`)
      })
  }
  async deleteAttendance(attendanceId) {
    return await this.http
      .delete(`/attendances/${attendanceId}/`)
      .then(() => {
        modal.open({
          component: 'SnackBar',
          props: { type: 'success', text: 'Atendimento deletado.' }
        })
      })
      .catch(e => {
        console.error(`Ocorreu um erro ${e}`)
      })
  }
}

const factory = httpClient => new Attendance(httpClient)

export default factory
