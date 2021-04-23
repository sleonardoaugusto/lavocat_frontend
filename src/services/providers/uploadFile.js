export default class UploadFile {
  constructor(http) {
    this.http = http
  }
  uploadFiles(files, method, url) {
    return Promise.all(
      files.map(file => {
        const requestData = {
          method: method,
          url: url,
          data: file,
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }
        return this.http.request(requestData).then(resp => resp)
      })
    ).then(resp => resp)
  }
}
