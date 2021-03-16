export default httpClient => ({
  create: async(data) => {
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

    const files = data.files
    delete data.files

    const response = await httpClient.post('/attendances/', data)
    const { id } = response.data

    await uploadFiles(files, id)

    return {
      data: response.data
    }
  }
})
