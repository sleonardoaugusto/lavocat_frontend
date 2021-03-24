import Vue from 'vue'
import VueRouter from 'vue-router'

const AttendanceForm = import('@/views/AttendanceForm')
const AttendanceList = import('@/views/AttendanceList')

Vue.use(VueRouter)

export const routes = [
  {
    path: '/atendimento/novo',
    name: 'attendance',
    component: () => AttendanceForm
  },
  {
    path: '/atendimentos',
    name: 'attendances',
    component: () => AttendanceList
  },
  {
    path: '*',
    redirect: '/atendimentos'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
