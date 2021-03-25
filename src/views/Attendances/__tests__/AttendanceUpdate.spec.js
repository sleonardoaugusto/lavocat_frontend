import { mount } from '@vue/test-utils'
import AttendanceUpdate from '@/views/Attendances/AttendanceUpdate'
import services from '@/services'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueTheMask from 'vue-the-mask'
import busy from '@/mixins/busy'

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

  test('Must call update attendance service on receive emit', async () => {
    const spy = jest.spyOn(services.attendance, 'updateAttendance')
    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})

    expect(spy).toHaveBeenCalledWith(1, {})
  })
})
