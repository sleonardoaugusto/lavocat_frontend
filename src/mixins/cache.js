export default {
  mounted() {
    this.$_validate()
    this.$_applyCache()
  },
  methods: {
    $_validate() {
      this.$_validateDefinedObjects()
      this.$_validateCacheKeys()
    },
    $_validateDefinedObjects() {
      if (!this.form) console.error('form data must be defined')
      if (!this.cacheKeys) console.error('cacheKeys data must be defined')
    },
    $_validateCacheKeys() {
      const validKeys = Object.keys(this.form)
      const undefinedKeys = []
      this.cacheKeys.map(key => {
        if (!validKeys.includes(key)) undefinedKeys.push(key)
      })
      if (undefinedKeys.length)
        console.error(
          `${undefinedKeys} key(s) does not exist inside of form object`
        )
    },
    $_applyCache() {
      if (!this.update) {
        const componentName = this.$options.name
        const cache = localStorage.getItem(componentName)
        if (cache) this.form = { ...JSON.parse(cache) }
      }
    }
  },
  watch: {
    form: {
      deep: true,
      handler(val) {
        localStorage.setItem(this.$options.name, JSON.stringify(val))
      }
    }
  }
}
