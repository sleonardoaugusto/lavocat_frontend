import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueTheMask from 'vue-the-mask'
import busy from '@/mixins/busy'
import services from '@/services'
import { mount } from '@vue/test-utils'
import AttendanceCreate from '@/views/Attendances/AttendanceCreate'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import router from '@/router'
import { registerGlobalComponents, globalComponents } from '@/components/global'

jest.mock('@/services')
jest.mock('@/router')

describe('<AttendanceCreate />', () => {
  registerGlobalComponents(Vue)
  Vue.use(Vuetify)
  Vue.use(Vuelidate)
  Vue.use(VueTheMask)
  Vue.use(VueRouter)
  Vue.mixin(busy)

  let wrapper
  let vuetify
  let stubs

  beforeEach(() => {
    stubs = { AttendanceForm: true }
    vuetify = new Vuetify()
    wrapper = factory()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const factory = opts =>
    mount(AttendanceCreate, { Vue, vuetify, stubs, ...opts })

  it('Should call create attendance service on receive emit', async () => {
    services.attendance.createAttendance.mockResolvedValueOnce({})
    const spy = jest.spyOn(services.attendance, 'createAttendance')

    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})

    expect(spy).toHaveBeenCalledWith({})
  })

  it('Should be loading during request', async () => {
    services.attendance.createAttendance.mockResolvedValueOnce({})

    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})

    expect(
      wrapper.findComponent({ ref: 'attendanceForm' }).vm.busy,
    ).toBeTruthy()
  })

  it('Should not be loading after promise resolve', async () => {
    services.attendance.createAttendance.mockResolvedValueOnce({})

    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})
    await flushPromises()

    expect(wrapper.findComponent({ ref: 'attendanceForm' }).vm.busy).toBeFalsy()
  })

  it('Should not be loading after promise reject', async () => {
    services.attendance.createAttendance.mockRejectedValueOnce({})

    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})
    await flushPromises()

    expect(wrapper.findComponent({ ref: 'attendanceForm' }).vm.busy).toBeFalsy()
  })

  it('Should redirect to attendances list after save', async () => {
    services.attendance.createAttendance.mockResolvedValueOnce({ id: 1 })
    const spy = jest.spyOn(router, 'push')

    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})
    await flushPromises()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      name: 'attendances-update',
      params: { attendanceId: 1 },
    })
  })
})
