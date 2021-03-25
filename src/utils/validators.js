export const cpfValidator = value =>
  value?.toString().replace('.', '')?.replace('.', '')?.replace('-', '')
    .length === 11
