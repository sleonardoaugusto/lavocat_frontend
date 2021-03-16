<template>
  <v-snackbar v-model="showInternal" :timeout="timeout" color="grey darken-3">
    <v-icon
      color="green accent-3"
      dark
      right
    >
      mdi-checkbox-marked-circle
    </v-icon>
    {{ text }}

    <template v-slot:action="{ attrs }">
      <v-btn
        v-show="showCloseBtn"
        id="close"
        color="grey lighten-2"
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
    showCloseBtn: {
      type: Boolean,
      default: true
    },
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
    showInternal: null,
    timeout: 5000
  }),
  created() {
    setTimeout(() => {
      this.close()
    }, this.timeout)
  },
  methods: {
    close() {
      modal.close()
    }
  },
  watch: {
    show: {
      immediate: true,
      handler(val) {
        this.showInternal = val
      }
    }
  }
}
</script>

<style scoped></style>
