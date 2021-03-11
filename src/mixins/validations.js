const Params = {
  REQUIRED: 'required',
  MIN_LENGTH: 'minLength',
  MIN_VALUE: 'minValue',
  MAX_VALUE: 'maxValue'
}

export default {
  methods: {
    touch() {
      this.$v.$touch()
    },
    errorMessage(field) {
      this.validate()
      const validationParams = Object.keys(this.$v.form[field].$params)
      return this.getErrorMessage(field, validationParams)
    },
    validate() {
      if (!this.$v.form) {
        throw new Error('You must declare fields inside "form" attribute.')
      }
    },
    getErrorMessage(field, validationParams) {
      const errors = []
      validationParams.forEach(param => {
        if (!this.$v.form[field].$dirty) return
        const message = this.getMessage(field, param)
        !this.$v.form[field][param] && errors.push(message)
      })
      return errors[0] || null
    },
    getMessage(field, validationParam) {
      const messageParam = this.getMessageParam(field, validationParam)
      const Messages = {
        [`${Params.REQUIRED}`]: 'Campo obrigatório',
        [`${Params.MIN_LENGTH}`]: `Campo deve conter no mínimo ${messageParam} caracteres`,
        [`${Params.MIN_VALUE}`]: `O valor deve ser no mínimo ${messageParam}`,
        [`${Params.MAX_VALUE}`]: `O valor deve ser menor que ${messageParam}`
      }
      return Messages?.[validationParam] ?? 'Campo inválido'
    },
    getMessageParam(field, validationParam) {
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
