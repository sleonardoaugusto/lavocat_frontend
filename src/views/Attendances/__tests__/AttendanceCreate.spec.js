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

jest.mock('@/services')

describe('<AttendanceCreate />', () => {
  Vue.use(Vuetify)
  Vue.use(Vuelidate)
  Vue.use(VueTheMask)
  Vue.use(VueRouter)
  Vue.mixin(busy)

  let wrapper
  let vuetify

  const stubs = { AttendanceForm: true }

  beforeEach(() => {
    vuetify = new Vuetify()
    wrapper = factory()
  })

  const factory = opts =>
    mount(AttendanceCreate, { Vue, vuetify, stubs, ...opts })

  test('Should call create attendance service on receive emit', async () => {
    const spy = jest.spyOn(services.attendance, 'createAttendance')

    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})

    expect(spy).toHaveBeenCalledWith({})
  })

  test('Should be loading during request', async () => {
    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})

    expect(
      wrapper.findComponent({ ref: 'attendanceForm' }).vm.busy
    ).toBeTruthy()
  })

  test('Should not be loading after request', async () => {
    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})
    await flushPromises()

    expect(wrapper.findComponent({ ref: 'attendanceForm' }).vm.busy).toBeFalsy()
  })
})
