import axios from 'axios'
import AttendanceService from '../attendance'
import faker from 'faker'

jest.mock('axios')

describe('AttendanceService', () => {
  describe('createAttendance', () => {
    test('Must parse files to form data structure', async () => {
      axios.post.mockResolvedValueOnce({ data: {} })
      axios.request.mockResolvedValueOnce({ data: {} })
      const spy = jest.spyOn(axios, 'post')

      const data = {
        customer_name: faker.random.word(),
        document_id: faker.random.number(),
        files: [new File(['foo'], 'foo.txt')]
      }
      await AttendanceService(axios).createAttendance(data)

      expect(spy).toHaveBeenCalledWith('/attendances/', data)
    })
  })

  describe('getAttendances', () => {
    test('Must return data value', async () => {
      axios.get.mockResolvedValueOnce({ data: [{}] })

      const resp = await AttendanceService(axios).getAttendances()

      expect(resp).toStrictEqual([{}])
    })

    test('Must return empty array if response error', async () => {
      axios.get.mockRejectedValueOnce()

      const resp = await AttendanceService(axios).getAttendances()

      expect(resp).toStrictEqual([])
    })
  })

  describe('getStatuses', () => {
    test('Must call get statuses', async () => {
      axios.get.mockResolvedValueOnce()
      const spy = jest.spyOn(axios, 'get')
      await AttendanceService(axios).getStatuses()

      expect(spy).toHaveBeenCalledWith('/attendance-statuses/')
    })

    test('Must return data value', async () => {
      axios.get.mockResolvedValueOnce({ data: {} })
      const resp = await AttendanceService(axios).getStatuses()

      expect(resp).toStrictEqual({})
    })

    test('Must return empty array if response error', async () => {
      axios.get.mockRejectedValueOnce()
      const resp = await AttendanceService(axios).getStatuses()

      expect(resp).toStrictEqual([])
    })
  })

  describe('updateAttendance', () => {
    it('Must call update', async () => {
      axios.put.mockResolvedValueOnce()
      const spy = jest.spyOn(axios, 'put')
      await AttendanceService(axios).updateAttendance(1, {})

      expect(spy).toHaveBeenCalledWith(`/attendances/${1}/`, {})
    })

    it('Must return response data', async () => {
      axios.put.mockResolvedValueOnce({ data: {} })
      const resp = await AttendanceService(axios).updateAttendance(1, {})

      expect(resp).toStrictEqual({})
    })

    test('Must return empty object if response error', async () => {
      axios.put.mockRejectedValueOnce()
      const resp = await AttendanceService(axios).updateAttendance(1)

      expect(resp).toStrictEqual({})
    })
  })

  describe('getAttendanceById', () => {
    it('Must call get attendance by id', async () => {
      axios.get.mockResolvedValueOnce({ data: {} })
      const spy = jest.spyOn(axios, 'get')
      await AttendanceService(axios).getAttendanceById(1)

      expect(spy).toHaveBeenCalledWith(`/attendances/${1}/`)
    })

    it('Must return response data', async () => {
      axios.get.mockResolvedValueOnce({ data: {} })
      const resp = await AttendanceService(axios).getAttendanceById(1)

      expect(resp).toStrictEqual({})
    })

    test('Must return empty object if response error', async () => {
      axios.get.mockRejectedValueOnce()
      const resp = await AttendanceService(axios).getAttendanceById(1)

      expect(resp).toStrictEqual({})
    })
  })
})
