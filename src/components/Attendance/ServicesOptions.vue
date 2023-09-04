<template>
  <v-combobox
    ref="servicesOptions"
    v-model="select"
    :items="items"
    label="Serviços prestados"
    multiple
    chips
    item-text="text"
    item-value="value"
  />
</template>

<script>
import { attendanceTypeOptions } from '@/constants'

export default {
  name: 'ServicesOptions',
  props: {
    selected: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    select: [],
    items: attendanceTypeOptions,
  }),
  watch: {
    select() {
      const values = this.select.map(option => option.value)
      this.$emit('changed', values)
    },
    selected: {
      handler(values) {
        if (
          values.length &&
          JSON.stringify(values) !==
            JSON.stringify(this.select.map(option => option.value))
        )
          this.select = this.items.filter(item => values.includes(item.value))
      },
    },
  },
}
</script>

<style scoped></style>
