<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        id="delete-icon"
        ref="deleteIcon"
        @click="onClick"
        icon
        small
        v-bind="attrs"
        v-on="on"
        :loading="isLoading"
      >
        <v-icon>mdi-trash-can-outline</v-icon>
        <AppDialogConfirm
          title="Remover atendimento"
          text="Tem certeza que deseja remover atendimento?"
          :show-dialog="showDialog"
          @confirm="onConfirm"
          @cancel="showDialog = false"
        />
      </v-btn>
    </template>
    <span>Remover</span>
  </v-tooltip>
</template>

<script>
import AppDialogConfirm from '@/components/ui/AppDialogConfirm'
import services from '@/services'

export default {
  name: 'AttendanceDelete',
  components: { AppDialogConfirm },
  props: {
    attendanceId: {
      type: [String, Number],
      required: true
    }
  },
  data: () => ({
    showDialog: false
  }),
  methods: {
    onClick() {
      this.showDialog = true
    },
    async onConfirm() {
      this.showDialog = false
      this.toggleLoading()
      await services.attendance
        .deleteAttendance(this.attendanceId)
        .then(() => this.$emit('delete'))
        .catch(() => {})
      this.toggleLoading()
    }
  }
}
</script>

<style scoped></style>
