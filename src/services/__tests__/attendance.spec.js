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
      await AttendanceService(axios).create(data)

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
})
