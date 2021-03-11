export default httpClient => ({
  create: async(data) => {
    const response = await httpClient.post('/attendance', data)

    return {
      data: response.data
    }
  }
})
