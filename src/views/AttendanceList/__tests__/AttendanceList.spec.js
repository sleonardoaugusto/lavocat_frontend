import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueTheMask from 'vue-the-mask'
import busy from '@/mixins/busy'
import AttendanceList from '@/views/AttendanceList'
import services from '@/services'
import flushPromises from 'flush-promises'

jest.mock('@/services')

const spy = jest.spyOn(services.attendance, 'getAttendances')

describe('<AttendanceList />', () => {
  Vue.use(Vuetify)
  Vue.use(Vuelidate)
  Vue.use(VueTheMask)
  Vue.mixin(busy)

  let wrapper
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    wrapper = factory()
  })

  afterEach(() => {
    spy.mockClear()
  })

  const factory = opts => mount(AttendanceList, { Vue, vuetify, ...opts })

  test('Component exists', () => {
    expect(wrapper.html()).toBeTruthy()
  })

  test('Must get attendances', async () => {
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('Table must receive attendances', async () => {
    services.attendance.getAttendances.mockResolvedValue([{}])
    wrapper = factory()

    await flushPromises()

    expect(
      wrapper.findComponent({ ref: 'attendancesList' }).vm.items
    ).toStrictEqual([{}])
  })

  test('Table must receive headers', async () => {
    const headers = [
      {
        text: 'Nome do Cliente',
        value: 'customer_name'
      },
      {
        text: 'Documento',
        value: 'document_id'
      }
    ]

    expect(
      wrapper.findComponent({ ref: 'attendancesList' }).vm.headers
    ).toStrictEqual(headers)
  })

  test('Table must be loading during request', async () => {
    wrapper = factory()

    expect(wrapper.findComponent({ ref: 'attendancesList' }).vm.loading).toBe(
      true
    )
  })

  test('Table must not be loading after response', async () => {
    expect(wrapper.findComponent({ ref: 'attendancesList' }).vm.loading).toBe(
      false
    )
  })
})
