import Vue from 'vue'
import VueRouter from 'vue-router'

const AttendanceForm = import('@/components/AttendanceForm')
const AttendanceList = import('@/views/AttendanceList')

Vue.use(VueRouter)

export const routes = [
  {
    path: '/atendimentos/novo',
    name: 'attendances-new',
    component: () => AttendanceForm
  },
  {
    path: '/atendimentos',
    name: 'attendances-list',
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
