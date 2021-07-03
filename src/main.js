import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import Vuelidate from 'vuelidate'
import busy from '@/mixins/busy'
import VueTheMask from 'vue-the-mask'
import services from '@/services'

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(VueTheMask)
Vue.mixin(busy)

new Vue({
  router,
  vuetify,
  render: h => h(App),
  created() {
    services.keepAlive()
  }
}).$mount('#app')
