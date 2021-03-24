<template>
  <div></div>
</template>

<script>
import services from '@/services'

export default {
  name: 'AttendanceList',
  props: {
    attendanceId: Number,
    required: true
  },
  created() {
    services.attendance.getAttendance(this.attendanceId)
  }
}
</script>

<style scoped>

</style>
