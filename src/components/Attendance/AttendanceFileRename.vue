<template>
  <div class="d-inline-flex">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          id="open-dialog"
          icon
          small
          v-bind="attrs"
          v-on="on"
          @click="showDialog = true"
        >
          <v-icon dark> mdi-pencil-outline </v-icon>
        </v-btn>
      </template>
      <span>Renomear</span>
    </v-tooltip>
    <AppDialog
      ref="dialog"
      :showDialog="showDialog"
      :filename="filename"
      title="Renomear arquivo"
      text="Digite o novo nome do arquivo"
      :fields="[
        {
          component: 'v-text-field',
          props: { label: 'Nome do arquivo' },
          model: 'text',
          value: filename
        }
      ]"
      @confirm="renameFile"
      @cancel="showDialog = false"
    />
  </div>
</template>

<script>
import services from '@/services'

export default {
  name: 'AttendanceFileRename',
  props: {
    file: {
      type: Object,
      required: true,
      default: null
    }
  },
  data: () => ({
    showDialog: false
  }),
  methods: {
    async renameFile(payload) {
      const fileExtension = this.file.filename.split('.').slice(-1)
      const filename = `${payload.text}.${fileExtension}`
      await services.attendanceFile
        .updateAttendanceFile(this.file.id, filename)
        .then(() => this.$emit('update'))
        .catch(() => {})
      this.showDialog = false
    }
  },
  computed: {
    filename() {
      return this.file.filename?.split('.')[0] || null
    }
  }
}
</script>

<style scoped></style>
