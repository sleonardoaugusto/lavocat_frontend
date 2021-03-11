<template>
  <v-row>
    <v-col>
      <div :class="`text-${tag} ${typography}`" v-text="text"/>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'BaseHeading',
  props: {
    text: {
      type: String,
      required: true,
      default: 'Title Example'
    },
    tag: {
      type: String,
      default: 'h4'
    },
    typography: {
      type: String,
      default: 'grey--text text--darken-3 font-weight-regular'
    }
  }
}
</script>

<style scoped></style>
