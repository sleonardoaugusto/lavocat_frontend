import Upload from '@/services/upload'
import flushPromises from 'flush-promises'

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

  test('Must upload all files in parallel', () => {
    const spy = jest.spyOn(httpClient, 'request')
    httpClient.request.mockResolvedValue({})

    const files = [{}, {}]
    const method = 'post'
    const url = '/'

    service.uploadFiles(files, method, url)

    const call1 = makePayload(files[0], method, url)
    const call2 = makePayload(files[1], method, url)

    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenCalledWith({ ...call1, ...call2 })
  })

  const makePayload = (file, method, url) => ({
    method: method,
    url: url,
    data: file,
    headers: {
      'Content-type': 'multipart/form-data'
    }
  })
})
