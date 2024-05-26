import useModal from '@/hooks/useModal'

const modal = useModal()

class Auth {
  constructor(http) {
    this.http = http
  }
  async login(data) {
    return await this.http
      .post('/api/token/', data)
      .then(resp => {
        const { access, is_superuser } = resp.data
        return { access, is_superuser }
      })
      .catch(() => {
        modal.open({
          component: 'SnackBar',
          props: { type: 'error', text: 'Credenciais inválidas.' },
        })
        return { access: null, is_superuser: null }
      })
  }
}

const factory = httpClient => new Auth(httpClient)

export default factory
