<template>
  <div>
    <BaseHeading text="Lista de Atendimentos" />
    <v-row>
      <v-col>
        <v-data-table
          ref="attendancesList"
          :headers="headers"
          :items="attendances"
          :items-per-page="10"
          class="elevation-1"
          :loading="isLoading"
          loading-text="Carregando atendimentos... Por favor aguarde"
        >
          <template v-slot:item.attendanceLink="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :id="`attendance-${item.id}`"
                  :ref="`attendance${item.id}`"
                  :href="`/atendimentos/${item.id}/editar`"
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon dark> mdi-pencil-outline </v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>
          </template>
        </v-data-table>
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
      },
      { text: 'Ação', value: 'attendanceLink' }
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
