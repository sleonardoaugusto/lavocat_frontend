import useModal from '@/hooks/useModal'
const modal = useModal()

export default httpClient => ({
  createAttendance: async data => {
    async function uploadFiles(files, attendanceId) {
      async function upload(formData) {
        const requestData = {
          method: 'post',
          url: '/attendance-files/',
          data: formData,
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }
        const response = await httpClient.request(requestData)
        return response.data
      }

      const promises = files.map(async f => {
        const fd = new FormData()
        fd.append('attendance', attendanceId)
        fd.append('file', f)
        await upload(fd)
      })
      await Promise.all(promises)
    }

    try {
      const files = data.files
      delete data.files

      const response = await httpClient.post('/attendances/', data)
      const { id } = response.data

      await uploadFiles(files, id)

      modal.open({
        component: 'SnackBar',
        props: { type: 'success', text: 'Atendimento criado!' }
      })

      return {
        data: response.data
      }
    } catch (e) {
      return {
        error: e
      }
    }
  },

  getAttendances: () =>
    httpClient
      .get('/attendances/')
      .then(res => res.data)
      .catch(() => []),

  getStatuses: () =>
    httpClient
      .get(`/attendance-statuses/`)
      .then(res => res.data)
      .catch(() => []),

  updateAttendance: (id, data) =>
    httpClient
      .put(`/attendances/${id}/`, data)
      .then(res => {
        modal.open({
          component: 'SnackBar',
          props: { type: 'success', text: 'Atendimento salvo!' }
        })
        return res.data
      })
      .catch(() => ({})),

  getAttendanceById: id =>
    httpClient
      .get(`/attendances/${id}/`)
      .then(res => res.data)
      .catch(() => ({}))
})
