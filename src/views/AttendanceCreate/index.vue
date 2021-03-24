<template>
  <div>
    <BaseHeading text="Novo Atendimento" />
    <AttendanceForm ref="attendanceForm" @submit="createAttendance" />
  </div>
</template>

<script>
import AttendanceForm from '@/views/AttendanceForm'
import services from '@/services'
import BaseHeading from '@/components/base/BaseHeading'

export default {
  name: 'AttendanceCreate',
  components: { BaseHeading, AttendanceForm },
  methods: {
    async createAttendance(data) {
      await services.attendance.create(data)
    }
  }
}
</script>

<style scoped></style>
