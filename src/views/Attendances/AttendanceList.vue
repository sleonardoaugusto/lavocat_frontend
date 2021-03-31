<template>
  <div>
    <BaseHeading text="Lista de Atendimentos" />
    <v-row>
      <v-col class="text-right">
        <v-btn ref="newAttendance" href="/atendimentos/novo" color="primary">
          Novo
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <v-row>
              <v-col>
                <v-text-field
                  id="customer-name-filter"
                  append-icon="mdi-magnify"
                  label="Buscar por Nome ou CPF"
                  clearable
                  single-line
                  @input="setFilters"
                  @keydown.enter="getAttendances(filters)"
                  @click:append="getAttendances(filters)"
                  @click:clear="getAttendances()"
                />
              </v-col>
            </v-row>
          </v-card-title>
          <v-data-table
            ref="attendancesList"
            :headers="headers"
            :items="attendances"
            :items-per-page="10"
            class="elevation-1"
            :loading="isLoading"
            loading-text="Carregando atendimentos... Por favor aguarde"
          >
            <template v-slot:item.status_label="{ item }">
              <v-chip
                :color="statusColor(item.status)"
                text-color="white"
                class="font-weight-medium"
                label
                small
              >
                {{ item.status_label }}
              </v-chip>
            </template>
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
        </v-card>
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
      {
        text: 'Status',
        value: 'status_label'
      },
      {
        text: 'Ação',
        value: 'attendanceLink'
      }
    ],
    attendances: [],
    filters: {
      customer_name: '',
      document_id: ''
    }
  }),
  created() {
    this.getAttendances()
  },
  methods: {
    async getAttendances(filters) {
      this.toggleLoading()
      this.attendances = await services.attendance.getAttendances(filters)
      this.toggleLoading()
    },
    statusColor(status) {
      const colors = {
        1: 'red',
        2: 'blue',
        3: 'orange',
        4: 'green'
      }
      return colors[status]
    },
    setFilters(value) {
      let params

      if (!isNaN(value)) {
        params = { customer_name: '', document_id: value }
      } else {
        params = { customer_name: value, document_id: '' }
      }

      this.filters = { ...this.filters, ...params }
    }
  }
}
</script>

<style scoped></style>
