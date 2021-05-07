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
    AttendanceForm
  },
  props: {
    attendanceId: {
      type: [String, Number],
      required: true
    }
  },
  data: () => ({
    internalAttendance: {}
  }),
  created() {
    this.getAttendance(this.attendanceId)
  },
  methods: {
    async getAttendance(id) {
      this.toggleLoading()
      this.internalAttendance = await services.attendance.getAttendanceById(id)
      this.toggleLoading()
    },
    async onSubmit(data) {
      this.toggleLoading()
      await services.attendance.updateAttendance(this.attendanceId, data)
      this.toggleLoading()
      router.push({ name: 'attendances-list' })
    }
  }
}
</script>

<style scoped></style>
