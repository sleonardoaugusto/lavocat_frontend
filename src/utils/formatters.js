export const objToSelect = dict => {
  if (dict)
    return Object.entries(dict).map(([key, value]) => ({
      text: key,
      value: value
    }))
}

export const clearDocumentId = value => {
  if (value) return value.replace('.', '').replace('.', '').replace('-', '')
}
