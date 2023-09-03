<template>
  <v-dialog
    v-model="internalShowDialog"
    @keydown.esc="onCancel"
    @keydown.enter="onConfirm"
    @click:outside="onCancel"
    max-width="25rem"
  >
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>{{ text }}</v-card-text>
      <v-card-text>
        <template v-for="(field, idx) in fields">
          <component
            :key="idx"
            :ref="`field-${idx}`"
            :is="field.component"
            v-bind="field.props"
            v-model="form[field.model]"
          />
        </template>
      </v-card-text>
      <v-card-actions>
        <v-btn id="cancel" text @click="onCancel"> {{ btnCancelTxt }} </v-btn>
        <v-spacer />
        <v-btn id="confirm" color="error" text @click="onConfirm">
          {{ btnConfirmTxt }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AppDialog',
  props: {
    showDialog: {
      type: Boolean,
    },
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    btnCancelTxt: {
      type: String,
      default: 'cancelar',
    },
    btnConfirmTxt: {
      type: String,
      default: 'confirmar',
    },
    fields: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    internalShowDialog: false,
    form: {},
  }),
  methods: {
    onConfirm() {
      this.$emit('confirm', this.form)
    },
    onCancel() {
      this.$emit('cancel')
    },
  },
  watch: {
    showDialog(val) {
      this.internalShowDialog = val
    },
    fields(val) {
      const fields = {}
      val.forEach(field => (fields[field.model] = field.value))
      this.form = { ...fields }
    },
  },
}
</script>

<style scoped></style>
