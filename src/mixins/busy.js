export default {
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    toggleLoading() {
      this.isLoading = !this.isLoading
    }
  }
}
