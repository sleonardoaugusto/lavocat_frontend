import Attendance from '@/services/attendanceClass'
import Upload from '@/services/upload'
import useModal from '@/hooks/useModal'
import flushPromises from 'flush-promises'

jest.mock('@/services/upload')

const modal = useModal

describe('Attendance Service', () => {
  let service
  let httpClient

  beforeEach(() => {
    httpClient = { post: jest.fn() }
    service = Attendance(httpClient)
  })

  test('Constructor', () => {
    expect(service.http).toBe(httpClient)
  })

  describe('createAttendance', () => {
    test('Axios post method must be called with data', () => {
      httpClient.post.mockResolvedValueOnce({ data: {} })
      const spy = jest.spyOn(httpClient, 'post')

      service.createAttendance({})

      expect(spy).toHaveBeenCalledWith({})
    })

    test('createAttendance method must call uploadAttendanceFiles method passing files and attendance id', async () => {
      httpClient.post.mockResolvedValueOnce({ data: { id: 1 } })
      const spy = jest.spyOn(service, 'uploadAttendanceFiles')

      await service.createAttendance({ files: [{}] })

      expect(spy).toHaveBeenCalledWith(1, [{}])
    })

    test('createAttendance method must return response data', async () => {
      httpClient.post.mockResolvedValueOnce({ data: {} })

      const resp = await service.createAttendance({})

      expect(resp).toEqual({})
    })

    test('createAttendance method must open modal on success request', async () => {
      httpClient.post.mockResolvedValueOnce({ data: {} })
      const spy = jest.spyOn(modal, 'open')

      await service.createAttendance({})

      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('uploadAttendanceFiles', () => {
    jest.mock('@/services/upload')

    test('Parse files and call uploadFile method', () => {
      service.uploadAttendanceFiles(1, [{}, {}])

      const mockUploadService = Upload.mock.instances[0]
      const mockUploadFile = mockUploadService.uploadFiles

      expect(mockUploadFile).toHaveBeenCalledTimes(1)
    })
  })
})
