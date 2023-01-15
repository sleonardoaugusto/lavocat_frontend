<template>
  <v-dialog
    v-model="internalShowDialog"
    @keydown.esc="onCancel"
    max-width="25rem"
  >
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>{{ text }}</v-card-text>
      <v-card-text>
        <template v-for="(field, idx) in fields">
          <component
            :key="idx"
            :is="field.component"
            v-bind="field.attrs"
            v-model="form[field.model]"
          />
        </template>
      </v-card-text>
      <v-card-actions>
        <v-btn id="cancel" text @click="onCancel"> não </v-btn>
        <v-spacer />
        <v-btn id="confirm" color="error" text @click="onConfirm"> sim </v-btn>
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
      required: false
    },
    title: {
      type: String
    },
    text: {
      type: String
    },
    fields: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data: () => ({
    internalShowDialog: false,
    form: {}
  }),
  methods: {
    onConfirm() {
      this.$emit('confirm', this.form)
    },
    onCancel() {
      this.$emit('cancel')
    }
  },
  watch: {
    showDialog(val) {
      this.internalShowDialog = val
    },
    fields(val) {
      const fields = {}
      val.forEach(field => (fields[field.model] = field.value))
      this.form = { ...fields }
    }
  }
}
</script>

<style scoped></style>
