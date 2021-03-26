import useModal from '@/hooks/useModal'
import Upload from '@/services/upload'

const modal = useModal

class Attendance {
  constructor(http) {
    this.http = http
  }
  createAttendance(data) {
    return this.http.post(data).then(resp => {
      const { id } = resp.data
      const { files } = data
      this.uploadAttendanceFiles(id, files)

      modal.open({
        component: 'SnackBar',
        props: { type: 'success', text: 'Atendimento criado!' }
      })
      return resp.data
    })
  }
  uploadAttendanceFiles(attendanceId, files) {
    if (files && files.length) {
      const filesParsed = files.map(f => {
        const fd = new FormData()
        fd.append('attendance', 1)
        fd.append('file', f)
        return fd
      })

      const uploadService = new Upload(this.http)
      uploadService.uploadFiles(filesParsed, 'post', '/attendance-files/')
    }
  }
}

const factory = httpClient => new Attendance(httpClient)

export default factory
