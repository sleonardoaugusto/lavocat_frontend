<template>
  <v-snackbar v-model="show" :timeout="timeout">
    {{ text }}

    <template v-slot:action="{ attrs }">
      <v-btn
        id="close"
        color="red"
        text
        v-bind="attrs"
        @click="close"
      >
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import useModal from '@/hooks/useModal'

const modal = useModal()
export default {
  name: 'SnackBar',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  data: () => ({
    timeout: 5000
  }),
  methods: {
    close() {
      modal.close()
    }
  }
}
</script>

<style scoped></style>
