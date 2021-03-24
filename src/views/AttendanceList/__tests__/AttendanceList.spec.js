import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueTheMask from 'vue-the-mask'
import busy from '@/mixins/busy'
import AttendanceList from '@/views/AttendanceList'
import services from '@/services/.'

// jest.mock('@/services')

describe('<AttendanceList />', () => {
  Vue.use(Vuetify)
  Vue.use(Vuelidate)
  Vue.use(VueTheMask)
  Vue.mixin(busy)

  let wrapper
  let vuetify
  let propsData

  beforeEach(() => {
    propsData = { attendanceId: 1 }
    vuetify = new Vuetify()
    wrapper = factory()
  })

  const factory = opts => mount(AttendanceList, { Vue, vuetify, propsData, ...opts })

  test('Component exists', () => {
    expect(wrapper.html()).toBeTruthy()
  })

  test('Must get attendance by id', async() => {
    const spy = jest.spyOn(services.attendance, 'getAttendance')
    wrapper = factory()
    expect(spy).toHaveBeenCalledWith(1)
  })
})
