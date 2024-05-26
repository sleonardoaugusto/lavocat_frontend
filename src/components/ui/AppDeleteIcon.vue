<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-show="isSuperUser"
        id="delete-icon"
        ref="deleteIcon"
        @click="onClick"
        icon
        small
        v-bind="attrs"
        v-on="on"
        :loading="loading"
      >
        <v-icon>mdi-trash-can-outline</v-icon>
        <AppDialog
          :title="dialogTitle"
          :text="dialogText"
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
export default {
  name: 'AppDeleteIcon',
  props: {
    loading: {
      type: Boolean,
    },
    dialogTitle: {
      type: String,
      required: true,
    },
    dialogText: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    showDialog: false,
  }),
  methods: {
    onClick() {
      this.showDialog = true
    },
    async onConfirm() {
      this.showDialog = false
      this.$emit('delete')
    },
  },
}
</script>

<style scoped></style>
