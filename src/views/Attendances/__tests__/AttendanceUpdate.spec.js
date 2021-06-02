import { mount } from '@vue/test-utils'
import AttendanceUpdate from '@/views/Attendances/AttendanceUpdate'
import services from '@/services'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueTheMask from 'vue-the-mask'
import busy from '@/mixins/busy'
import flushPromises from 'flush-promises'
import router from '@/router'

jest.mock('@/services')
jest.mock('@/router')

describe('<AttendanceUpdate />', () => {
  Vue.use(Vuetify)
  Vue.use(Vuelidate)
  Vue.use(VueTheMask)
  Vue.mixin(busy)

  let wrapper
  let vuetify
  let stubs
  let propsData

  beforeEach(() => {
    stubs = { AttendanceForm: true }
    propsData = { attendanceId: 1 }
    vuetify = new Vuetify()
    wrapper = factory()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const factory = opts =>
    (wrapper = mount(AttendanceUpdate, {
      Vue,
      vuetify,
      propsData,
      stubs,
      ...opts
    }))

  it('Should get attendance data', () => {
    const spy = jest.spyOn(services.attendance, 'getAttendanceById')

    expect(spy).toHaveBeenCalledWith(1)
  })

  it('Form component should be busy during request', () => {
    wrapper = factory()

    expect(
      wrapper.findComponent({ ref: 'attendanceForm' }).vm.busy
    ).toBeTruthy()
  })

  it('Form component should not be busy after request', async () => {
    wrapper = factory()
    await flushPromises()

    expect(wrapper.findComponent({ ref: 'attendanceForm' }).vm.busy).toBeFalsy()
  })

  it('Form component should receive attendance data', async () => {
    services.attendance.getAttendanceById.mockResolvedValueOnce({
      some: 'data'
    })

    wrapper = factory()
    await flushPromises()

    expect(
      wrapper.findComponent({ ref: 'attendanceForm' }).vm.value
    ).toStrictEqual({ some: 'data' })
  })

  it('Should call update attendance service on receive emit', async () => {
    const spy = jest.spyOn(services.attendance, 'updateAttendance')

    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})

    expect(spy).toHaveBeenCalledWith(1, {})
  })

  it('Form component should receive update props true', () => {
    expect(wrapper.findComponent({ ref: 'attendanceForm' }).vm.update).toBe(
      true
    )
  })

  it('Should be loading during request', async () => {
    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})

    expect(
      wrapper.findComponent({ ref: 'attendanceForm' }).vm.busy
    ).toBeTruthy()
  })

  it('Should not be loading after request', async () => {
    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})
    await flushPromises()

    expect(wrapper.findComponent({ ref: 'attendanceForm' }).vm.busy).toBeFalsy()
  })

  it('Should redirect to attendances list after update', async () => {
    services.attendance.updateAttendance.mockResolvedValueOnce({})
    services.attendance.getAttendanceById.mockResolvedValueOnce({ key: 'pair' })

    const spy = jest.spyOn(router, 'push')

    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})
    await flushPromises()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ name: 'attendances-list' })
  })
})
