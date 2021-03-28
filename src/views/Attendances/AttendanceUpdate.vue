<template>
  <div>
    <BaseHeading text="Editar Atendimento" />
    <AttendanceForm
      ref="attendanceForm"
      :update="true"
      :value="internalAttendance"
      @submit="updateAttendance"
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
      this.internalAttendance = await services.attendance.getAttendanceById(id)
    },
    async updateAttendance(data) {
      this.toggleLoading()
      await services.attendance.updateAttendance(this.attendanceId, data)
      this.toggleLoading()
    }
  }
}
</script>

<style scoped></style>
