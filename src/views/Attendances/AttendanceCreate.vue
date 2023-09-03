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

export default {
  name: 'AttendanceCreate',
  components: { AttendanceForm },
  methods: {
    onSubmit(data) {
      this.toggleLoading()
      services.attendance
        .createAttendance(data)
        .then(resp => {
          this.toggleLoading()
          localStorage.removeItem('atttendance-form-cache')
          router.push({
            name: 'attendances-update',
            params: { attendanceId: resp.id },
          })
        })
        .catch(() => this.toggleLoading())
    },
  },
}
</script>

<style scoped></style>
