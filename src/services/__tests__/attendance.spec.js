import Attendance from '@/services/attendance'

jest.mock('@/services/providers/uploadFile')

describe('Attendance Service', () => {
  let service
  let httpClient

  beforeEach(() => {
    httpClient = {
      post: jest.fn(),
      put: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    }
    service = Attendance(httpClient)
    jest.clearAllMocks()
  })

  it('Constructor', () => {
    expect(service.http).toBe(httpClient)
  })

  describe('Create attendance', () => {
    beforeEach(() => {
      httpClient.post.mockResolvedValueOnce({ data: { id: 1 } })
    })

    it('Should create attendance', () => {
      const spy = jest.spyOn(httpClient, 'post')

      service.createAttendance({})

      expect(spy).toHaveBeenCalledWith('/attendances/', {})
    })

    it('Should call uploadAttendanceFiles method passing files and attendance id', async () => {
      const spy = jest.spyOn(
        service.attendanceFileService,
        'uploadAttendanceFiles',
      )

      await service.createAttendance({ files: [{}] })

      expect(spy).toHaveBeenCalledWith(1, [{}])
    })

    it('Should return response data', async () => {
      const resp = await service.createAttendance({})

      expect(resp).toEqual({ id: 1 })
    })
  })

  describe('Update attendance', () => {
    beforeEach(() => {
      httpClient.put.mockResolvedValueOnce({ data: {} })
    })

    it('Should update attendance', () => {
      const spy = jest.spyOn(httpClient, 'put')

      service.updateAttendance(1, {})

      expect(spy).toHaveBeenCalledWith('/attendances/1/', {})
    })

    it('Should call uploadAttendanceFiles method passing files and attendance id', async () => {
      const spy = jest.spyOn(
        service.attendanceFileService,
        'uploadAttendanceFiles',
      )

      await service.updateAttendance(1, { files: [{}] })

      expect(spy).toHaveBeenCalledWith(1, [{}])
    })

    it('Should return response data', async () => {
      const resp = await service.updateAttendance(1, {})

      expect(resp).toEqual({})
    })

    it('Should return response error', async () => {
      httpClient.put.mockRejectedValueOnce({})

      const resp = await service.updateAttendance(1, {})

      expect(resp).toEqual({})
    })
  })

  describe('Delete attendance', () => {
    beforeEach(() => {
      httpClient.delete.mockResolvedValueOnce({})
    })

    it('Should delete attendance', () => {
      const spy = jest.spyOn(httpClient, 'delete')

      service.deleteAttendance(1)

      expect(spy).toHaveBeenCalledWith(`/attendances/1/`)
    })
  })

  describe('Get attendances', () => {
    beforeEach(() => {
      httpClient.get.mockResolvedValueOnce({ data: [] })
    })

    it('Should get attendances', () => {
      const spy = jest.spyOn(httpClient, 'get')

      service.getAttendances()

      expect(spy).toHaveBeenCalledWith('/attendances/', { params: {} })
    })

    it('Should get attendances with querystring', () => {
      const spy = jest.spyOn(httpClient, 'get')

      service.getAttendances({
        customer_name: '',
        document_id: '',
        services_types: ['A', 'B'],
      })

      expect(spy).toHaveBeenCalledWith('/attendances/', {
        params: {
          customer_name: '',
          document_id: '',
          services_types: ['A', 'B'],
        },
      })
    })

    it('Should return response data', async () => {
      const resp = await service.getAttendances()

      expect(resp).toEqual([])
    })
  })

  describe('Attendance', () => {
    beforeEach(() => {
      httpClient.get.mockResolvedValueOnce({ data: {} })
    })

    it('Should get attendance by id', () => {
      const spy = jest.spyOn(httpClient, 'get')

      service.getAttendanceById(1)

      expect(spy).toHaveBeenCalledWith('/attendances/1/')
    })

    it('Should return response data', async () => {
      const resp = await service.getAttendanceById(1)

      expect(resp).toEqual({})
    })
  })
})
