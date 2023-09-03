import AttendanceFileService from '@/services/attendance-file'
import UploadFile from '@/services/providers/uploadFile'
import flushPromises from 'flush-promises'

jest.mock('@/services/providers/uploadFile')

describe('AttendanceFile Service', () => {
  let service
  let httpClient

  beforeEach(() => {
    httpClient = {
      post: jest.fn(),
      put: jest.fn(),
      get: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    }
    service = AttendanceFileService(httpClient)
    jest.clearAllMocks()
  })

  it('Constructor', () => {
    expect(service.http).toBe(httpClient)
  })

  describe('Get files', () => {
    it('Should get files by attendance id', async () => {
      httpClient.get.mockResolvedValueOnce({ data: [{}] })
      const spy = jest.spyOn(httpClient, 'get')

      const resp = await service.getFilesByAttendanceId(1)

      expect(spy).toHaveBeenCalledWith(`/attendances/1/attendance-files/`)
      expect(resp).toStrictEqual([{}])
    })
  })

  describe('Update file', () => {
    it('Should update file', async () => {
      httpClient.patch.mockResolvedValueOnce({ data: [{}] })
      const spy = jest.spyOn(httpClient, 'patch')

      const resp = await service.updateAttendanceFile(1, 'new-name.txt')

      expect(spy).toHaveBeenCalledWith('/attendance-files/1/', {
        filename: 'new-name.txt',
      })
      expect(resp).toStrictEqual([{}])
    })
  })

  describe('Upload attendance files', () => {
    it('Should upload files', async () => {
      const files = [new File(['t'], 'teste.txt')]
      await service.uploadAttendanceFiles(1, files)
      const mockUploadService = UploadFile.mock.instances[0]
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

    it('Should delete file', () => {
      const spy = jest.spyOn(httpClient, 'delete')

      service.deleteAttendanceFile(1)

      expect(spy).toHaveBeenCalledWith(`/attendance-files/1/`)
    })
  })
})
