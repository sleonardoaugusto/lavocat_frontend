export default class Upload {
  constructor(http) {
    this.http = http
  }
  uploadFiles(files, method, url) {
    return Promise.all(
      files.map(f => {
        const requestData = {
          method: method,
          url: url,
          data: f,
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }
        return this.http.request(requestData).then(resp => resp)
      })
    ).then(resp => resp)
  }
}
