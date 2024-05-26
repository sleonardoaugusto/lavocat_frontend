export class Auth {
  static isLoggedIn() {
    return !!localStorage.getItem('token')
  }
  static login(access, isSuperUser) {
    if (access) localStorage.setItem('token', access)
    if (isSuperUser !== undefined && isSuperUser !== null)
      localStorage.setItem('is_superuser', isSuperUser)
    window.location.reload()
  }
  static logout(err) {
    if (err.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('is_superuser')
      if (!err.response.config.url.includes('api/token')) {
        window.location.reload()
      }
    }
  }
}
