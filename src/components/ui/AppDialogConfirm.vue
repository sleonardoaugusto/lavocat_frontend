<template>
  <v-row justify="center">
    <v-dialog
      v-model="internalShowDialog"
      @keydown.esc="onCancel"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline"> Deletar arquivo </v-card-title>
        <v-card-text> Tem certeza que deseja deletar arquivo? </v-card-text>
        <v-card-actions>
          <v-btn id="cancel" text @click="onCancel"> não </v-btn>
          <v-spacer></v-spacer>
          <v-btn id="confirm" color="error" text @click="onConfirm">
            sim
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'AppDialogConfirm',
  props: {
    showDialog: {
      type: Boolean,
      required: false
    }
  },
  data: () => ({
    internalShowDialog: false
  }),
  methods: {
    onConfirm() {
      this.$emit('confirm')
    },
    onCancel() {
      this.$emit('cancel')
    }
  },
  watch: {
    showDialog(val) {
      this.internalShowDialog = val
    }
  }
}
</script>

<style scoped></style>
