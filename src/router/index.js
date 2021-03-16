import Vue from 'vue'
import VueRouter from 'vue-router'

const AttendanceForm = import('@/views/AttendanceForm')

Vue.use(VueRouter)

export const routes = [
  {
    path: '/atendimento/novo',
    name: 'attendance',
    component: () => AttendanceForm
  },
  {
    path: '*',
    redirect: '/atendimento/novo'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
