import Attendance from '@/services/attendance'
import Upload from '@/services/upload'
import flushPromises from 'flush-promises'

jest.mock('@/services/upload')

describe('Attendance Service', () => {
  let service
  let httpClient

  beforeEach(() => {
    httpClient = {
      post: jest.fn(),
      put: jest.fn(),
      get: jest.fn(),
      delete: jest.fn()
    }
    service = Attendance(httpClient)
    jest.clearAllMocks()
  })

  test('Constructor', () => {
    expect(service.http).toBe(httpClient)
  })

  describe('Create attendance', () => {
    beforeEach(() => {
      httpClient.post.mockResolvedValueOnce({ data: { id: 1 } })
    })

    test('Must create attendance', () => {
      let spy = jest.spyOn(httpClient, 'post')

      service.createAttendance({})

      expect(spy).toHaveBeenCalledWith('/attendances/', {})
    })

    test('Must call uploadAttendanceFiles method passing files and attendance id', async () => {
      const spy = jest.spyOn(service, 'uploadAttendanceFiles')
      httpClient.post.mockResolvedValueOnce({ data: { id: 1 } })

      await service.createAttendance({ files: [{}] })

      expect(spy).toHaveBeenCalledWith(1, [{}])
    })

    test('Must return response data', async () => {
      const resp = await service.createAttendance({})

      expect(resp).toEqual({ id: 1 })
    })
  })

  describe('Update attendance', () => {
    beforeEach(() => {
      httpClient.put.mockResolvedValueOnce({ data: {} })
    })

    test('Must update attendance', () => {
      const spy = jest.spyOn(httpClient, 'put')

      service.updateAttendance(1, {})

      expect(spy).toHaveBeenCalledWith('/attendances/1/', {})
    })

    test('Must call uploadAttendanceFiles method passing files and attendance id', async () => {
      const spy = jest.spyOn(service, 'uploadAttendanceFiles')

      await service.updateAttendance(1, { files: [{}] })

      expect(spy).toHaveBeenCalledWith(1, [{}])
    })

    test('Must return response data', async () => {
      const resp = await service.updateAttendance(1, {})

      expect(resp).toEqual({})
    })
  })

  describe('Upload attendance files', () => {
    test('Must upload files', async () => {
      const files = [new File(['t'], 'teste.txt')]
      await service.uploadAttendanceFiles(1, files)
      const mockUploadService = Upload.mock.instances[0]
      const mockUploadFile = mockUploadService.uploadFiles

      await flushPromises()

      expect(mockUploadFile).toHaveBeenCalledTimes(1)
      expect(mockUploadFile.mock.calls[0][0]).toHaveLength(1)
      expect(mockUploadFile.mock.calls[0][0][0]).toBeInstanceOf(FormData)
      expect(mockUploadFile.mock.calls[0][1]).toBe('post')
      expect(mockUploadFile.mock.calls[0][2]).toBe('/attendance-files/')
    })
  })

  describe('Delete attendance file', () => {
    beforeEach(() => {
      httpClient.delete.mockResolvedValueOnce({})
    })

    test('Must delete file', () => {
      const spy = jest.spyOn(httpClient, 'delete')

      service.deleteAttendanceFile(1)

      expect(spy).toHaveBeenCalledWith(`/attendance-files/1/`)
    })
  })

  describe('Get attendances', () => {
    beforeEach(() => {
      httpClient.get.mockResolvedValueOnce({ data: [] })
    })

    test('Must get attendances', () => {
      const spy = jest.spyOn(httpClient, 'get')

      service.getAttendances()

      expect(spy).toHaveBeenCalledWith('/attendances/', { params: {} })
    })

    test('Must get attendances with querystring', () => {
      const spy = jest.spyOn(httpClient, 'get')

      service.getAttendances({ customer_name: 'Any Name' })

      expect(spy).toHaveBeenCalledWith('/attendances/', {
        params: { customer_name: 'Any Name' }
      })
    })

    test('Must return response data', async () => {
      const resp = await service.getAttendances()

      expect(resp).toEqual([])
    })
  })

  describe('Attendance', () => {
    beforeEach(() => {
      httpClient.get.mockResolvedValueOnce({ data: {} })
    })

    test('Must get attendance by id', () => {
      const spy = jest.spyOn(httpClient, 'get')

      service.getAttendanceById(1)

      expect(spy).toHaveBeenCalledWith('/attendances/1/')
    })

    test('Must return response data', async () => {
      const resp = await service.getAttendanceById(1)

      expect(resp).toEqual({})
    })
  })

  describe('Attendance statuses', () => {
    beforeEach(() => {
      httpClient.get.mockResolvedValueOnce({ data: {} })
    })

    test('Must get attendance statuses', () => {
      const spy = jest.spyOn(httpClient, 'get')

      service.getStatuses()

      expect(spy).toHaveBeenCalledWith('/attendance-statuses/')
    })

    test('Must return response data', async () => {
      const resp = await service.getStatuses()

      expect(resp).toEqual({})
    })
  })
})
