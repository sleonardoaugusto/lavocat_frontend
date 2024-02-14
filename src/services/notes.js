import useModal from '@/hooks/useModal'

const modal = useModal()

class Notes {
  constructor(http) {
    this.http = http
  }
  async getNotes(attendanceId) {
    return await this.http
      .get(`/attendances/${attendanceId}/notes/`)
      .then(resp => resp.data)
  }
  async updateNote(attendanceId, noteId, data) {
    return await this.http
      .patch(`/attendances/${attendanceId}/notes/${noteId}/`, data)
      .then(resp => {
        modal.open({
          component: 'SnackBar',
          props: { type: 'success', text: 'Notas salvas com sucesso!' },
        })
        return resp.data
      })
      .catch(err => {
        modal.open({
          component: 'SnackBar',
          props: { type: 'error', text: 'Erro ao salvar notas' },
        })
        throw new Error(err)
      })
  }
}

const factory = httpClient => new Notes(httpClient)

export default factory
