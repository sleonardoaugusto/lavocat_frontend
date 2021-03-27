import Attendance from '@/services/attendance'
import Upload from '@/services/upload'

jest.mock('@/services/upload')

describe('Attendance Service', () => {
  let service
  let httpClient

  beforeEach(() => {
    httpClient = { post: jest.fn(), put: jest.fn(), get: jest.fn() }
    service = Attendance(httpClient)
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
      await service.createAttendance({ files: [{}] })

      expect(spy).toHaveBeenCalledWith(1, [{}])
    })

    test('Must return response data', async () => {
      const resp = await service.createAttendance({})

      expect(resp).toEqual({ id: 1 })
    })
  })

  describe('Upload attendance files', () => {
    jest.mock('@/services/upload')

    test('Must upload files', () => {
      service.uploadAttendanceFiles(1, [{}, {}])
      const mockUploadService = Upload.mock.instances[0]
      const mockUploadFile = mockUploadService.uploadFiles

      expect(mockUploadFile).toHaveBeenCalledTimes(1)
    })
  })

  describe('Update attendance', () => {
    beforeEach(() => {
      httpClient.put.mockResolvedValueOnce({ data: {} })
    })

    test('Must update attendance', async () => {
      const spy = jest.spyOn(httpClient, 'put')
      await service.updateAttendance(1, {})

      expect(spy).toHaveBeenCalledWith('/attendances/1/', {})
    })

    test('Must return response data', async () => {
      const resp = await service.updateAttendance(1, {})

      expect(resp).toEqual({})
    })
  })

  describe('Get attendances', () => {
    beforeEach(() => {
      httpClient.get.mockResolvedValueOnce({ data: [] })
    })

    test('Must get attendances', async () => {
      const spy = jest.spyOn(httpClient, 'get')
      await service.getAttendances()

      expect(spy).toHaveBeenCalledWith('/attendances/')
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

    test('Must get attendance by id', async () => {
      const spy = jest.spyOn(httpClient, 'get')
      await service.getAttendanceById(1)

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

    test('Must get attendance statuses', async () => {
      const spy = jest.spyOn(httpClient, 'get')
      await service.getStatuses()

      expect(spy).toHaveBeenCalledWith('/attendance-statuses/')
    })

    test('Must return response data', async () => {
      const resp = await service.getStatuses()

      expect(resp).toEqual({})
    })
  })
})
