<template>
  <div>
    <BaseHeading text="Editar Atendimento" />
    <AttendanceForm ref="attendanceForm" @submit="updateAttendance" />
  </div>
</template>

<script>
import BaseHeading from '@/components/base/BaseHeading'
import AttendanceForm from '@/components/AttendanceForm/AttendanceForm'
import services from '@/services'

export default {
  name: 'AttendanceUpdate',
  components: {
    BaseHeading,
    AttendanceForm
  },
  props: {
    attendanceId: {
      type: Number,
      required: true
    }
  },
  created() {
    this.getAttendance(this.attendanceId)
  },
  methods: {
    async getAttendance(id) {
      await services.attendance.getAttendanceById(id)
    },
    updateAttendance(data) {
      services.attendance.updateAttendance(this.attendanceId, data)
    }
  }
}
</script>

<style scoped></style>
