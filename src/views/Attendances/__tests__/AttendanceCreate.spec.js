import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueTheMask from 'vue-the-mask'
import busy from '@/mixins/busy'
import services from '@/services'
import { mount } from '@vue/test-utils'
import AttendanceCreate from '@/views/Attendances/AttendanceCreate'

describe('<AttendanceCreate />', () => {
  Vue.use(Vuetify)
  Vue.use(Vuelidate)
  Vue.use(VueTheMask)
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

  test('Must call create attendance service on receive emit', async () => {
    const spy = jest.spyOn(services.attendance, 'createAttendance')
    await wrapper
      .findComponent({ ref: 'attendanceForm' })
      .vm.$emit('submit', {})

    expect(spy).toHaveBeenCalledWith({})
  })
})