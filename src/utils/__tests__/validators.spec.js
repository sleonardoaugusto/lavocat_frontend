import { cpfValidator } from '@/utils/validators'

describe('validators.js', () => {
  it('Must remove dots and commas', () => {
    expect(cpfValidator('999.999.999-99')).toBe(true)
  })

  it.each([['999.999.999-9'], [9999999999]])(
    '%s value must return false',
    value => {
      expect(cpfValidator(value)).toBe(false)
    }
  )
})
