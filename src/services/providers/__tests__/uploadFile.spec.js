import UploadFile from '@/services/providers/uploadFile'

describe('Upload Service', () => {
  let service
  let httpClient

  beforeEach(() => {
    httpClient = { request: jest.fn() }
    service = new UploadFile(httpClient)
  })

  it('Constructor', () => {
    expect(service.http).toBe(httpClient)
  })

  it('Should upload all files in parallel', () => {
    const spy = jest.spyOn(httpClient, 'request')
    httpClient.request.mockResolvedValue({})

    const files = [{}, {}]
    const method = 'post'
    const url = '/'

    service.uploadFiles(files, method, url)

    const call1 = mockPayload(files[0], method, url)
    const call2 = mockPayload(files[1], method, url)

    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenCalledWith({ ...call1, ...call2 })
  })

  const mockPayload = (file, method, url) => ({
    method: method,
    url: url,
    data: file,
    headers: {
      'Content-type': 'multipart/form-data'
    }
  })
})
