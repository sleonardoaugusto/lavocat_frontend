import { clearDocumentId } from '@/utils/formatters'

describe('formatters.js', () => {
  it('Should clear dots and hyphen', () => {
    expect(clearDocumentId('999.999.999-99')).toBe('99999999999')
  })

  it('Should not give an error if has no value', () => {
    expect(clearDocumentId('')).toBe(undefined)
  })
})
