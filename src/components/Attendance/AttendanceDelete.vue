<template>
  <AppDeleteIcon
    ref="deleteIcon"
    dialog-title="Remover atendimento"
    dialog-text="Tem certeza que deseja remover atendimento?"
    :loading="isLoading"
    @delete="onDelete"
  />
</template>

<script>
import services from '@/services'

export default {
  name: 'AttendanceDelete',
  props: {
    attendanceId: {
      type: [String, Number],
      required: true,
    },
  },
  methods: {
    async onDelete() {
      this.toggleLoading()
      await services.attendance
        .deleteAttendance(this.attendanceId)
        .then(() => this.$emit('delete'))
        .catch(() => {})
      this.toggleLoading()
    },
  },
}
</script>

<style scoped></style>
