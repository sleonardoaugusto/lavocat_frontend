import useModal from '@/hooks/useModal'
import Upload from '@/services/upload'

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
      props: { type: 'success', text: 'Atendimento criado!' }
    })

    return resp.data
  }
  async uploadAttendanceFiles(attendanceId, files) {
    if (files && files.length) {
      const filesParsed = files.map(f => {
        const fd = new FormData()
        fd.append('attendance', attendanceId)
        fd.append('file', f)
        return fd
      })

      const uploadService = new Upload(this.http)
      await uploadService.uploadFiles(filesParsed, 'post', '/attendance-files/')
    }
  }
  async updateAttendance(attendanceId, data) {
    return await this.http
      .put(`/attendances/${attendanceId}/`, data)
      .then(resp => {
        modal.open({
          component: 'SnackBar',
          props: { type: 'success', text: 'Atendimento salvo!' }
        })
        return resp.data
      })
      .catch(() => ({}))
  }
  async getAttendances() {
    return await this.http.get('/attendances/').then(resp => resp.data)
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
  }
}

const factory = httpClient => new Attendance(httpClient)

export default factory
