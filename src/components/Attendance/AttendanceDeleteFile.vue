<template>
  <AppDeleteIcon
    dialog-title="Deletar arquivo"
    dialog-text="Tem certeza que deseja deletar arquivo?"
    :loading="isLoading"
    @delete="onDelete"
  />
  <!--  <v-tooltip bottom>-->
  <!--    <template v-slot:activator="{ on, attrs }">-->
  <!--      <v-btn-->
  <!--        id="delete-icon"-->
  <!--        ref="deleteIcon"-->
  <!--        @click="onClick"-->
  <!--        icon-->
  <!--        small-->
  <!--        v-bind="attrs"-->
  <!--        v-on="on"-->
  <!--        :loading="isLoading"-->
  <!--      >-->
  <!--        <v-icon>mdi-trash-can-outline</v-icon>-->
  <!--        <AppDialogConfirm-->
  <!--          title="Deletar arquivo"-->
  <!--          text="Tem certeza que deseja deletar arquivo?"-->
  <!--          :show-dialog="showDialog"-->
  <!--          @confirm="onDelete"-->
  <!--          @cancel="showDialog = false"-->
  <!--        />-->
  <!--      </v-btn>-->
  <!--    </template>-->
  <!--    <span>Remover</span>-->
  <!--  </v-tooltip>-->
</template>

<script>
import AppDeleteIcon from '@/components/ui/AppDeleteIcon'
import services from '@/services'

export default {
  name: 'AttendanceDeleteFile',
  components: { AppDeleteIcon },
  props: {
    file: {
      type: [Object, File],
      required: true
    }
  },
  methods: {
    async onDelete() {
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
