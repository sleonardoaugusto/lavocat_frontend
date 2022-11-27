<template>
  <div>
    <AppHeading text="Novo Atendimento" />
    <AttendanceForm ref="attendanceForm" @submit="onSubmit" :busy="isLoading" />
  </div>
</template>

<script>
import AttendanceForm from '@/components/Attendance/AttendanceForm'
import services from '@/services'
import router from '@/router'
import AppHeading from '@/components/ui/AppHeading'

export default {
  name: 'AttendanceCreate',
  components: { AppHeading, AttendanceForm },
  methods: {
    async onSubmit(data) {
      this.toggleLoading()
      await services.attendance
        .createAttendance(data)
        .then(() => {
          this.toggleLoading()
          router.push({ name: 'attendances-list' })
        })
        .catch(() => {
          this.toggleLoading()
        })
    }
  }
}
</script>

<style scoped></style>
