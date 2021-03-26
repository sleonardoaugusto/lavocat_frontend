export default class Upload {
  constructor(http) {
    this.http = http
  }
  uploadFiles(files, method, url) {
    const requestData = {
      method: method,
      url: url,
      data: files,
      headers: {
        'Content-type': 'multipart/form-data'
      }
    }
    this.http.request(requestData)
  }
}
