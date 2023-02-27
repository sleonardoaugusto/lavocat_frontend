<template>
  <AppDeleteIcon
    ref="deleteIcon"
    dialog-title="Deletar arquivo"
    dialog-text="Tem certeza que deseja deletar arquivo?"
    :loading="isLoading"
    @delete="onDelete"
  />
</template>

<script>
import services from '@/services'

export default {
  name: 'AttendanceDeleteFile',
  props: {
    file: {
      type: [Object, File],
      required: true
    }
  },
  methods: {
    async onDelete() {
      if (!this.isFile(this.file)) {
        this.toggleLoading()
        const { id } = this.file
        await services.attendanceFile
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
