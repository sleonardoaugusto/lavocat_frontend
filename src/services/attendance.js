import useModal from '@/hooks/useModal'
import Upload from '@/services/upload'

const modal = useModal()

class Attendance {
  constructor(http) {
    this.http = http
  }
  async createAttendance(data) {
    const { files } = data
    return await this.http.post('/attendances/', data).then(resp => {
      const { id } = resp.data
      this.uploadAttendanceFiles(id, files)

      modal.open({
        component: 'SnackBar',
        props: { type: 'success', text: 'Atendimento criado!' }
      })
      return resp.data
    })
  }
  async updateAttendance(attendanceId, data) {
    return await this.http
      .put(`/attendances/${attendanceId}/`, data)
      .then(resp => resp.data)
      .catch(() => ({}))
  }
  uploadAttendanceFiles(attendanceId, files) {
    if (files && files.length) {
      const filesParsed = files.map(f => {
        const fd = new FormData()
        fd.append('attendance', attendanceId)
        fd.append('file', f)
        return fd
      })

      const uploadService = new Upload(this.http)
      uploadService.uploadFiles(filesParsed, 'post', '/attendance-files/')
    }
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
}

const factory = httpClient => new Attendance(httpClient)

export default factory
