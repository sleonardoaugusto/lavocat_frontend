const Params = {
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
      const validationParams = Object.keys(this.$v.form[field].$params)
      return this.$_getErrorMessage(field, validationParams)
    },
    $_validate() {
      if (!this.$v.form) {
        throw new Error('You must declare fields inside "form" attribute.')
      }
    },
    $_getErrorMessage(field, validationParams) {
      const errors = []
      validationParams.forEach(param => {
        if (!this.$v.form[field].$dirty) return
        const message = this.$_getMessage(field, param)
        !this.$v.form[field][param] && errors.push(message)
      })
      return errors[0] || null
    },
    $_getMessage(field, validationParam) {
      const messageParam = this.$_getMessageParam(field, validationParam)
      const Messages = {
        [`${Params.REQUIRED}`]: 'Campo obrigatório',
        [`${Params.MIN_LENGTH}`]: `Campo deve conter no mínimo ${messageParam} caracteres`,
        [`${Params.MIN_VALUE}`]: `O valor deve ser no mínimo ${messageParam}`,
        [`${Params.MAX_VALUE}`]: `O valor deve ser menor que ${messageParam}`,
        [`${Params.CPF_VALIDATOR}`]: 'Campo deve conter 11 dígitos'
      }
      return Messages?.[validationParam] ?? 'Campo inválido'
    },
    $_getMessageParam(field, validationParam) {
      let messageParam
      const prefix = this.$v.form[field].$params[validationParam]
      if (
        validationParam === Params.MIN_LENGTH ||
        validationParam === Params.MIN_VALUE
      ) {
        messageParam = prefix.min
      } else if (validationParam === Params.MAX_VALUE) messageParam = prefix.max
      return messageParam
    }
  },
  computed: {
    formIsReady() {
      return !this.$v.$invalid
    }
  }
}
