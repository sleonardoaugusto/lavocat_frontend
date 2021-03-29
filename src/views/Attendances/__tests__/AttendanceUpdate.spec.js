import { mount } from '@vue/test-utils'
import AttendanceUpdate from '@/views/Attendances/AttendanceUpdate'
import services from '@/services'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueTheMask from 'vue-the-mask'
import busy from '@/mixins/busy'
import flushPromises from 'flush-promises'

jest.mock('@/services')

describe('<AttendanceUpdate />', () => {
  Vue.use(Vuetify)
  Vue.use(Vuelidate)
  Vue.use(VueTheMask)
  Vue.mixin(busy)

  let wrapper
  let vuetify

  const stubs = { AttendanceForm: true }
  const propsData = { attendanceId: 1 }

  beforeEach(() => {
    vuetify = new Vuetify()
    wrapper = factory()
  })

  const factory = opts =>
    (wrapper = mount(AttendanceUpdate, {
      Vue,
      vuetify,
      propsData,
      stubs,
      ...opts
    }))

  test('Must get attendance data', () => {
    const spy = jest.spyOn(services.attendance, 'getAttendanceById')

    expect(spy).toHaveBeenCalledWith(1)
  })

  test('Form component must be busy during request', () => {
    services.attendance.getAttendanceById.mockResolvedValueOnce({})

    wrapper = factory()

    expect(
      wrapper.findComponent({ ref: 'attendanceForm' }).vm.busy
    ).toBeTruthy()
  })

  test('Form component must not be busy after request', async () => {
    services.attendance.getAttendanceById.mockResolvedValueOnce({})

    wrapper = factory()
    await flushPromises()

    expect(wrapper.findComponent({ ref: 'attendanceForm' }).vm.busy).toBeFalsy()
  })

  test('Form component must receive attendance data', async () => {
    services.attendance.getAttendanceById.mockResolvedValueOnce({
      some: 'data'
    })
    wrapper = factory()

    await flushPromises()

    expect(
      wrapper.findComponent({ ref: 'attendanceForm' }).vm.value
    ).toStrictEqual({ some: 'data' })
  })

  test('Must call update attendance service on receive emit', async () => {
    const spy = jest.spyOn(services.attendance, 'updateAttendance')

    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})

    expect(spy).toHaveBeenCalledWith(1, {})
  })

  test('Form component must receive update props true', () => {
    expect(wrapper.findComponent({ ref: 'attendanceForm' }).vm.update).toBe(
      true
    )
  })

  test('Must be loading during request', async () => {
    services.attendance.updateAttendance.mockResolvedValueOnce({})

    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})

    expect(
      wrapper.findComponent({ ref: 'attendanceForm' }).vm.busy
    ).toBeTruthy()
  })

  test('Must not be loading after request', async () => {
    services.attendance.updateAttendance.mockResolvedValueOnce({})

    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})
    await flushPromises()

    expect(wrapper.findComponent({ ref: 'attendanceForm' }).vm.busy).toBeFalsy()
  })

  test('Must refresh form data from database after update', async () => {
    services.attendance.updateAttendance.mockResolvedValueOnce({})
    services.attendance.getAttendanceById.mockResolvedValueOnce({ key: 'pair' })

    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})
    await flushPromises()

    expect(
      wrapper.findComponent({ ref: 'attendanceForm' }).vm.value
    ).toStrictEqual({ key: 'pair' })
  })
})
