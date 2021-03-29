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
import router from '@/router'

export default {
  name: 'AttendanceCreate',
  components: { BaseHeading, AttendanceForm },
  methods: {
    async createAttendance(data) {
      this.toggleLoading()
      await services.attendance.createAttendance(data)
      this.toggleLoading()
      router.push({ name: 'attendances-list' }).catch(() => {})
    }
  }
}
</script>

<style scoped></style>
