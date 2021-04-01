import { clearDocumentId } from '@/utils/formatters'

describe('formatters.js', () => {
  test('Should clear dots and hyphen', () => {
    expect(clearDocumentId('999.999.999-99')).toBe('99999999999')
  })
})
