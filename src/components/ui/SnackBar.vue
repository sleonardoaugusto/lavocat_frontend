<template>
  <v-snackbar
    @input="close"
    :timeout="timeout"
    v-model="showInternal"
    color="grey darken-3"
  >
    <v-icon :color="success ? 'green accent-4' : 'red accent-5'" dark>
      {{ success ? 'mdi-checkbox-marked-circle' : 'mdi-alert-circle' }}
    </v-icon>
    <span class="ml-2 font-weight-medium">{{ text }}</span>

    <template v-slot:action="{ attrs }">
      <v-btn
        v-show="showCloseBtn"
        id="close"
        text
        v-bind="attrs"
        @click="close"
        icon
      >
        <v-icon size="18"> mdi-close </v-icon>
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
      type: String
    },
    type: {
      type: String
    }
  },
  data: () => ({
    showInternal: true,
    timeout: 2500
  }),
  methods: {
    close() {
      modal.close({ type: this.type })
    }
  },
  computed: {
    success() {
      return this.type === 'success'
    }
  },
  watch: {
    show: {
      handler(val) {
        this.showInternal = val
      }
    }
  }
}
</script>

<style scoped></style>
