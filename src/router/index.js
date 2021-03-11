import Vue from 'vue'
import VueRouter from 'vue-router'

const AttendanceForm = import('@/views/AttendanceForm/index')

Vue.use(VueRouter)

export const routes = [
  {
    path: '/form',
    name: 'AttendanceForm',
    component: () => AttendanceForm
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
