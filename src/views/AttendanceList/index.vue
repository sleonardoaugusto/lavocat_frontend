<template>
  <div>
    <BaseHeading text="Lista de Atendimentos" />
    <v-row>
      <v-col>
        <v-data-table
          ref="attendancesList"
          :headers="headers"
          :items="attendances"
          :items-per-page="5"
          class="elevation-1"
          :loading="isLoading"
          loading-text="Carregando atendimentos... Por favor aguarde"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import services from '@/services'
import BaseHeading from '@/components/base/BaseHeading'

export default {
  name: 'AttendanceList',
  components: { BaseHeading },
  data: () => ({
    headers: [
      {
        text: 'Nome do Cliente',
        value: 'customer_name'
      },
      {
        text: 'Documento',
        value: 'document_id'
      }
    ],
    attendances: []
  }),
  created() {
    this.getAttendances()
  },
  methods: {
    async getAttendances() {
      this.toggleLoading()
      this.attendances = await services.attendance.getAttendances()
      this.toggleLoading()
    }
  }
}
</script>

<style scoped></style>
