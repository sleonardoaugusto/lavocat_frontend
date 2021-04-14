import Vue from 'vue'
import VueRouter from 'vue-router'
import { Auth } from '@/utils/auth'

const AttendanceCreate = import('@/views/Attendances/AttendanceCreate')
const AttendanceUpdate = import('@/views/Attendances/AttendanceUpdate')
const AttendanceList = import('@/views/Attendances/AttendanceList')
const Login = import('@/views/Login')

Vue.use(VueRouter)

export const routes = [
  {
    path: '/atendimentos',
    name: 'attendances-list',
    component: () => AttendanceList
  },
  {
    path: '/atendimentos/novo',
    name: 'attendances-new',
    component: () => AttendanceCreate
  },
  {
    path: '/atendimentos/:attendanceId/editar',
    name: 'attendances-update',
    component: () => AttendanceUpdate,
    props: true
  },
  {
    path: '/login/',
    name: 'login',
    component: () => Login
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

router.beforeEach((to, from, next) => {
  const isLoggedIn = Auth.isLoggedIn()
  if (to.name !== 'login' && !isLoggedIn) next({ name: 'login' })
  else if (to.name === 'login' && isLoggedIn) next({ name: 'home' })
  else next()
})

export default router
