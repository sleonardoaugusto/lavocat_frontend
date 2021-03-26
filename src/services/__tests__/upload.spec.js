import Upload from '@/services/upload'

describe('Upload Service', () => {
  let service
  let httpClient

  beforeEach(() => {
    httpClient = { request: jest.fn() }
    service = new Upload(httpClient)
  })

  test('Constructor', () => {
    expect(service.http).toBe(httpClient)
  })

  test('uploadFiles', () => {
    const spy = jest.spyOn(httpClient, 'request')

    const files = [{}, {}]
    const method = 'post'
    const url = '/'

    service.uploadFiles(files, method, url)

    expect(spy).toHaveBeenCalledWith({
      method: 'post',
      url: '/',
      data: files,
      headers: {
        'Content-type': 'multipart/form-data'
      }
    })
  })
})
