import useModal from '@/hooks/useModal'
import UploadFile from '@/services/providers/uploadFile'

const modal = useModal()

class AttendanceFile {
  constructor(http) {
    this.http = http
  }
  async getFilesByAttendanceId(attendanceId) {
    if (attendanceId) {
      return await this.http
        .get(`/attendances/${attendanceId}/attendance-files/`)
        .then(resp => resp.data)
        .catch(() =>
          modal.open({
            component: 'SnackBar',
            props: { type: 'error', text: 'Erro ao carregar arquivos.' }
          })
        )
    }
  }
  async uploadAttendanceFiles(attendanceId, files) {
    if (files && files.length) {
      const filesParsed = []

      for (let i = 0; i < files.length; i++) {
        if (files[i] instanceof File) {
          const fd = new FormData()
          fd.append('attendance', attendanceId)
          fd.append('file', files[i])
          fd.append('filename', files[i].name)
          filesParsed.push(fd)
        }
      }

      const uploadService = new UploadFile(this.http)
      await uploadService.uploadFiles(filesParsed, 'post', '/attendance-files/')
    }
  }
  async updateAttendanceFile(attendanceFileId, filename) {
    const data = { filename: filename }
    return await this.http
      .patch(`/attendance-files/${attendanceFileId}/`, data)
      .then(resp => {
        modal.open({
          component: 'SnackBar',
          props: { type: 'success', text: 'Arquivo renomeado.' }
        })
        return resp.data
      })
      .catch(() =>
        modal.open({
          component: 'SnackBar',
          props: { type: 'error', text: 'Erro ao renomear arquivo.' }
        })
      )
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
        modal.open({
          component: 'SnackBar',
          props: { type: 'error', text: `Ocorreu um erro ${e}` }
        })
      })
  }
}

const factory = httpClient => new AttendanceFile(httpClient)

export default factory
