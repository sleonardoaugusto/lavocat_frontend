<template>
  <div>
    <component :is="component" v-bind="componentProps"/>
  </div>
</template>

<script>
import SnackBar from '@/components/base/SnackBar'
import useModal from '@/hooks/useModal'

const modal = useModal()

export default {
  name: 'index.vue',
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
      const { props, component } = payload.props
      if (props.show) {
        this.component = component
      }
      this.componentProps = props
    }
  }
}
</script>

<style scoped>

</style>
