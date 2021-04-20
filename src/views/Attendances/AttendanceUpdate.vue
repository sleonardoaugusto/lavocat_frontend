<template>
  <div>
    <BaseHeading text="Editar Atendimento" />
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
import BaseHeading from '@/components/base/BaseHeading'
import AttendanceForm from '@/components/Attendance/AttendanceForm'
import services from '@/services'

export default {
  name: 'AttendanceUpdate',
  components: {
    BaseHeading,
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
      await this.getAttendance(this.attendanceId)
    }
  }
}
</script>

<style scoped></style>
