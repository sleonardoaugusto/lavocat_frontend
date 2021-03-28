export default class Upload {
  constructor(http) {
    this.http = http
  }
  async uploadFiles(files, method, url) {
    for (let i = 0; i < files.length; i++) {
      const requestData = {
        method: method,
        url: url,
        data: files[i],
        headers: {
          'Content-type': 'multipart/form-data'
        }
      }
      await this.http.request(requestData)
    }
  }
}
