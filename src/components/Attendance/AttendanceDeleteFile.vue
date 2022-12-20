<template>
  <AppDeleteIcon
    dialog-title="Deletar arquivo"
    dialog-text="Tem certeza que deseja deletar arquivo?"
    :loading="isLoading"
    @delete="onDelete"
  />
</template>

<script>
import AppDeleteIcon from '@/components/ui/AppDeleteIcon'
import services from '@/services'

export default {
  name: 'AttendanceDeleteFile',
  components: { AppDeleteIcon },
  props: {
    file: {
      type: [Object, File],
      required: true
    }
  },
  methods: {
    async onDelete() {
      if (!(this.file instanceof File)) {
        this.toggleLoading()
        const { id } = this.file
        await services.attendance
          .deleteAttendanceFile(id)
          .then(() => this.$emit('delete'))
          .catch(() => {})
        this.toggleLoading()
      } else {
        this.$emit('delete')
      }
    }
  }
}
</script>

<style scoped></style>
