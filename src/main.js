import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import Vuelidate from 'vuelidate'
import busy from '@/mixins/busy'
import VueTheMask from 'vue-the-mask'
import services from '@/services'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(VueTheMask)
Vue.mixin(busy)

Sentry.init({
  Vue,
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['localhost', 'my-site-url.com', /^\//]
    })
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

new Vue({
  router,
  vuetify,
  render: h => h(App),
  created() {
    services.keepAlive()
  }
}).$mount('#app')
