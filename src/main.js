import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import Vuelidate from 'vuelidate'
import busy from '@/mixins/busy'

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.mixin(busy)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
