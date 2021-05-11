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
          title="Deletar arquivo"
          text="Tem certeza que deseja deletar arquivo?"
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
  name: 'AttendanceDeleteIconFile',
  components: { AppDialogConfirm },
  props: {
    file: {
      type: [Object, File],
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
      if (!(this.file instanceof File)) {
        this.toggleLoading()
        const { id } = this.file
        await services.attendance
          .deleteAttendanceFile(id)
          .then(() => this.$emit('delete'))
          .catch(() => {})
        this.toggleLoading()
      } else {
        this.$emit('delete')
      }
    }
  }
}
</script>

<style scoped></style>
