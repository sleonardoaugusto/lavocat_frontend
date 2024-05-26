export default {
  methods: {
    isFile(object) {
      return object instanceof File
    },
  },
  computed: {
    isSuperUser() {
      return localStorage.getItem('is_superuser') === 'true'
    },
  },
}
