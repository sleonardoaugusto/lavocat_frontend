<template>
  <div>
    <BaseHeading text="Novo Atendimento" />
    <AttendanceForm
      ref="attendanceForm"
      @submit="createAttendance"
      :busy="isLoading"
    />
  </div>
</template>

<script>
import AttendanceForm from '@/components/Attendance/AttendanceForm'
import services from '@/services'
import BaseHeading from '@/components/base/BaseHeading'

export default {
  name: 'AttendanceCreate',
  components: { BaseHeading, AttendanceForm },
  methods: {
    async createAttendance(data) {
      this.toggleLoading()
      await services.attendance.createAttendance(data)
      this.toggleLoading()
    }
  }
}
</script>

<style scoped></style>
