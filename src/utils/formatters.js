export const objToSelect = dict => {
  if (dict)
    return Object.entries(dict).map(tuple => ({
      text: tuple[0],
      value: tuple[1]
    }))
}
