<template>
  <component :is="component" v-bind="componentProps" />
</template>

<script>
import SnackBar from '@/components/ui/SnackBar'
import useModal from '@/hooks/useModal'

const modal = useModal()

export default {
  name: 'ModalFactory',
  components: {
    SnackBar
  },
  data: () => ({
    component: null,
    componentProps: {}
  }),
  mounted() {
    modal.listen(this.modalToggle)
  },
  methods: {
    modalToggle(payload) {
      const { props, component } = payload
      if (props.show) {
        this.component = component
      }
      this.componentProps = props
    }
  }
}
</script>

<style scoped></style>
