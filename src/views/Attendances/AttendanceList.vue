<template>
  <div>
    <AppHeading text="Atendimentos" />
    <v-row>
      <v-col class="text-right">
        <v-btn
          id="new-attendance"
          ref="newAttendance"
          href="/atendimentos/novo"
          color="primary"
        >
          Novo
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="12" md="5">
                <v-text-field
                  id="customer-name-filter"
                  append-icon="mdi-magnify"
                  label="Buscar por Nome ou CPF"
                  clearable
                  single-line
                  @input="setFilters"
                  @keydown.enter="getAttendances(filters)"
                  @click:append="getAttendances(filters)"
                  @click:clear="getAttendances(filters)"
                />
              </v-col>
              <v-col cols="12" md="7" class="d-flex align-center">
                <v-chip-group
                  ref="attendanceTypeFilter"
                  multiple
                  column
                  @change="attendanceTypeFilter"
                >
                  <v-chip
                    v-for="attendanceType in attendanceTypeOptions"
                    :key="attendanceType.value"
                    outlined
                    filter
                    color="primary"
                  >
                    {{ attendanceType.text }}
                  </v-chip>
                </v-chip-group>
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
            :footer-props="{
              itemsPerPageAllText: 'Todos',
              itemsPerPageText: 'Qtd. por página',
            }"
          >
            <template v-slot:item.actions="{ item }">
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
              <AttendanceDelete
                :attendance-id="item.id"
                @delete="onAttendanceDelete(item.id)"
              />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import services from '@/services'
import AppHeading from '@/components/ui/AppHeading'
import AttendanceDelete from '@/components/Attendance/AttendanceDelete'
import { attendanceTypeOptions as attendanceOptions } from '@/constants'

export default {
  name: 'AttendanceList',
  components: { AttendanceDelete, AppHeading },
  data: () => ({
    headers: [
      {
        text: 'Nome do Cliente',
        value: 'customer_name',
      },
      {
        text: 'Resumo de Status',
        value: 'status_resume',
      },
      {
        text: 'Ações',
        value: 'actions',
      },
    ],
    attendanceTypeOptions: attendanceOptions,
    attendances: [],
    deletingAttendance: false,
    filters: {
      customer_name: '',
      document_id: '',
      services_provided: [],
    },
  }),
  created() {
    this.getAttendances()
  },
  methods: {
    attendanceTypeFilter(selected) {
      const statuses = []
      selected.map(idx => statuses.push(this.attendanceTypeOptions[idx].value))
      this.filters.services_provided = statuses
      this.getAttendances(this.filters)
    },
    async getAttendances(filters) {
      this.toggleLoading()
      this.attendances = await services.attendance.getAttendances(filters)
      this.toggleLoading()
    },
    setFilters(value) {
      let params

      if (isNaN(value)) {
        params = { customer_name: value, document_id: '' }
      } else {
        params = { customer_name: '', document_id: value }
      }

      this.filters = { ...this.filters, ...params }
    },
    onAttendanceDelete(attendanceId) {
      this.attendances = this.attendances.filter(
        attendance => attendance.id !== attendanceId,
      )
    },
  },
}
</script>

<style scoped></style>
