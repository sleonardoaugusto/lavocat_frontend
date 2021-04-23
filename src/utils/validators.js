function removeSpecialCharacters(documentId) {
  return documentId
    ?.toString()
    .replace('.', '')
    ?.replace('.', '')
    ?.replace('-', '')
}

export const cpfValidator = documentId => {
  if (!documentId) return true
  else {
    return removeSpecialCharacters(documentId).length === 11
  }
}
