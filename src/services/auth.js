class Auth {
  constructor(http) {
    this.http = http
  }
  async login(data) {
    return await this.http
      .post('/api/token/', data)
      .then(resp => resp.data)
      .catch(err => err)
  }
}

const factory = httpClient => new Auth(httpClient)

export default factory
