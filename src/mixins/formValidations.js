const Validations = {
  REQUIRED: 'required',
  MIN_LENGTH: 'minLength',
  MIN_VALUE: 'minValue',
  MAX_VALUE: 'maxValue',
  CPF_VALIDATOR: 'cpfValidator'
}

export default {
  methods: {
    touch() {
      this.$v.$touch()
    },
    errorMessage(field) {
      this.$_validate()
      const validations = this.$v.form[field].$params
      const validationNames = Object.keys(validations)
      return this.$_getErrorMessage(field, validationNames)
    },
    $_validate() {
      if (!this.$v.form) {
        throw new Error('You should declare fields inside a "form" attribute.')
      }
    },
    $_getErrorMessage(field, validationNames) {
      const errors = []
      validationNames.forEach(validationName => {
        if (this.$v.form[field].$dirty) {
          const message = this.$_getMessage(field, validationName)
          !this.$v.form[field][validationName] && errors.push(message)
        }
      })
      return errors[0] || null
    },
    $_getMessage(field, validationName) {
      const validationParam = this.$_getValidationParam(field, validationName)
      const Messages = {
        [`${Validations.REQUIRED}`]: 'Campo obrigatório',
        [`${Validations.MIN_LENGTH}`]: `Campo deve conter no mínimo ${validationParam} caracteres`,
        [`${Validations.MIN_VALUE}`]: `O valor deve ser no mínimo ${validationParam}`,
        [`${Validations.MAX_VALUE}`]: `O valor deve ser menor que ${validationParam}`,
        [`${Validations.CPF_VALIDATOR}`]: 'Campo deve conter 11 dígitos'
      }
      return Messages?.[validationName] ?? 'Campo inválido'
    },
    $_getValidationParam(field, validation) {
      let validationParam
      const fieldValidations = this.$v.form[field].$params
      const prefix = fieldValidations[validation]
      if (
        validation === Validations.MIN_LENGTH ||
        validation === Validations.MIN_VALUE
      ) {
        validationParam = prefix.min
      } else if (validation === Validations.MAX_VALUE)
        validationParam = prefix.max
      return validationParam
    }
  },
  computed: {
    formIsReady() {
      return !this.$v.$invalid
    }
  }
}
