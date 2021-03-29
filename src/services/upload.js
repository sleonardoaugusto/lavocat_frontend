export default class Upload {
  constructor(http) {
    this.http = http
  }
  uploadFiles(files, method, url) {
    files.map(f => {
      const requestData = {
        method: method,
        url: url,
        data: f,
        headers: {
          'Content-type': 'multipart/form-data'
        }
      }
      this.http.request(requestData)
    })
  }
}
