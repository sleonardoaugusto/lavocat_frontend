export class Auth {
  static setToken(token) {
    localStorage.setItem('token', token)
  }
  static removeToken() {
    localStorage.removeItem('token')
  }
  static isLoggedIn() {
    return !!localStorage.getItem('token')
  }
}
