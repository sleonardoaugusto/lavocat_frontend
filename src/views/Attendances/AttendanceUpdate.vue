<template>
  <div>
    <AppHeading text="Editar Atendimento" />
    <AttendanceForm
      ref="attendanceForm"
      @submit="onSubmit"
      :update="true"
      :value="internalAttendance"
      :busy="isLoading"
    />
  </div>
</template>

<script>
import AttendanceForm from '@/components/Attendance/AttendanceForm'
import services from '@/services'
import router from '@/router'
import AppHeading from '@/components/ui/AppHeading'

export default {
  name: 'AttendanceUpdate',
  components: {
    AppHeading,
    AttendanceForm,
  },
  props: {
    attendanceId: {
      type: [String, Number],
      required: true,
    },
  },
  data: () => ({
    internalAttendance: {},
  }),
  created() {
    this.getAttendance(this.attendanceId)
  },
  methods: {
    async getAttendance(id) {
      this.toggleLoading()
      services.attendance
        .getAttendanceById(id)
        .then(data => (this.internalAttendance = data))
        .finally(() => this.toggleLoading())
    },
    async onSubmit(data) {
      this.toggleLoading()
      services.attendance
        .updateAttendance(this.attendanceId, data)
        .finally(() => this.toggleLoading())
    },
  },
}
</script>

<style scoped></style>
