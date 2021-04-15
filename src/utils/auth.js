export class Auth {
  static isLoggedIn() {
    return !!localStorage.getItem('token')
  }
  static login(access) {
    if (access) {
      localStorage.setItem('token', access)
      window.location.reload()
    }
  }
  static logout(err) {
    if (err.response.status === 401) {
      localStorage.removeItem('token')
      if (!err.response.config.url.includes('api/token')) {
        window.location.reload()
      }
    }
  }
}
