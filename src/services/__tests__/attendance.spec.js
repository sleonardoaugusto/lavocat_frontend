import axios from 'axios'
import AttendanceService from '../attendance'
import faker from 'faker'

describe('AttendanceService', () => {
  test('Must parse files to form data structure', async() => {
    axios.post = jest.fn(() => Promise.resolve({ data: {} }))
    axios.request = jest.fn(() => Promise.resolve({ data: {} }))
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
