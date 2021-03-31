import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueTheMask from 'vue-the-mask'
import busy from '@/mixins/busy'
import AttendanceList from '@/views/Attendances/AttendanceList'
import services from '@/services'
import flushPromises from 'flush-promises'

jest.mock('@/services')

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

  const factory = opts => mount(AttendanceList, { Vue, vuetify, ...opts })

  test('New attendance btn', () => {
    expect(wrapper.findComponent({ ref: 'newAttendance' }).vm.$props.href).toBe(
      '/atendimentos/novo'
    )
  })

  test('Must get attendances', () => {
    const spy = jest.spyOn(services.attendance, 'getAttendances')

    spy.mockClear()
    wrapper = factory()

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

  test('Table must receive headers', () => {
    const headers = [
      {
        text: 'Nome do Cliente',
        value: 'customer_name'
      },
      {
        text: 'Documento',
        value: 'document_id'
      },
      {
        text: 'Status',
        value: 'status_label'
      },
      {
        text: 'Ação',
        value: 'attendanceLink'
      }
    ]

    expect(
      wrapper.findComponent({ ref: 'attendancesList' }).vm.headers
    ).toStrictEqual(headers)
  })

  test('Table must be loading during request', () => {
    wrapper = factory()

    expect(wrapper.findComponent({ ref: 'attendancesList' }).vm.loading).toBe(
      true
    )
  })

  test('Table must not be loading after response', () => {
    expect(wrapper.findComponent({ ref: 'attendancesList' }).vm.loading).toBe(
      false
    )
  })

  test('Table must contain button link to attendance', async () => {
    services.attendance.getAttendances.mockResolvedValue([{ id: 1 }])
    wrapper = factory()
    await flushPromises()

    expect(wrapper.findComponent({ ref: 'attendance1' }).vm.href).toBe(
      '/atendimentos/1/editar'
    )
  })

  test('Customer name filter', async () => {
    const spy = jest.spyOn(services.attendance, 'getAttendances')
    spy.mockClear()

    await wrapper.find('#customer-name-filter').setValue('Anonymous999')
    wrapper.find('#customer-name-filter').trigger('keydown.enter')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      customer_name: 'Anonymous999',
      document_id: ''
    })
  })

  test('Document id filter', async () => {
    const spy = jest.spyOn(services.attendance, 'getAttendances')
    spy.mockClear()

    await wrapper.find('#customer-name-filter').setValue('999')
    wrapper.find('#customer-name-filter').trigger('keydown.enter')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ customer_name: '', document_id: '999' })
  })
})
