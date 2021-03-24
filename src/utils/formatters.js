export const objToSelect = dict => {
  if (dict)
    return Object.entries(dict).map(([key, value]) => ({
      text: key,
      value: value
    }))
}
