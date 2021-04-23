import { cpfValidator } from '@/utils/validators'

describe('validators.js', () => {
  it.each([
    ['', true],
    ['999.999.999-99', true],
    ['999.999.999-9', false],
    [9999999999, false],
    [99999999999, true],
    ['9999999999', false],
    ['99999999999', true]
  ])('%s value should return %s', (value, bool) => {
    expect(cpfValidator(value)).toBe(bool)
  })
})
