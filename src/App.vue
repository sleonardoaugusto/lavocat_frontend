<template>
  <v-app>
    <v-main>
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
    <ModalFactory/>
  </v-app>
</template>

<script>
import ModalFactory from '@/components/ModalFactory/index'

export default {
  name: 'App',
  components: {
    ModalFactory
  }
}
</script>
