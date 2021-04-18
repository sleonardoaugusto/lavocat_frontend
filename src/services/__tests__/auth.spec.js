//{
//     "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjE4MjA5Mjc5LCJqdGkiOiJlYjIzZDUwOTM1Yzk0NzRlOWEwMzIyMTA2NjdkODBiZCIsInVzZXJfaWQiOjJ9.sZ932RotyiHwvc6Bod---kk9-PNm1wtqjTsV-zzvLhI",
//     "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYxODI5NTM3OSwianRpIjoiMWI2OTE0YTFjNTNkNGJjM2I1Yzk4YjYwMzU1OGFkNTEiLCJ1c2VyX2lkIjoyfQ.03Gc8lwyQlRBwNEkgZJT4OrrUvKhfFUzG-N07vTqXqo"
// }
import Auth from '@/services/auth'
import faker from 'faker'

describe('Auth Service', () => {
  let service
  let httpClient

  beforeEach(() => {
    httpClient = {
      post: jest.fn()
    }
    service = Auth(httpClient)
    jest.clearAllMocks()
  })

  it('Constructor', () => {
    expect(service.http).toBe(httpClient)
  })

  describe('Login', () => {
    let responseData

    beforeEach(() => {
      responseData = { access: faker.random.uuid() }
      httpClient.post.mockResolvedValueOnce({ data: responseData })
    })

    it('Should call /api/token/ with data', () => {
      const spy = jest.spyOn(httpClient, 'post')

      const data = {
        username: faker.random.word(),
        password: faker.random.word()
      }
      service.login(data)

      expect(spy).toHaveBeenCalledWith('/api/token/', data)
    })

    it('Should return response data', async () => {
      const resp = await service.login()

      expect(resp).toStrictEqual(responseData)
    })
  })
})
