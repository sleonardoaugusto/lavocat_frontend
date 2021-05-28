import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueTheMask from 'vue-the-mask'
import busy from '@/mixins/busy'
import AttendanceList from '@/views/Attendances/AttendanceList'
import services from '@/services'
import flushPromises from 'flush-promises'
import AttendanceDelete from '@/components/Attendance/AttendanceDelete'

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

  it('New attendance btn', () => {
    expect(wrapper.findComponent({ ref: 'newAttendance' }).vm.$props.href).toBe(
      '/atendimentos/novo'
    )
  })

  it('Should get attendances', () => {
    const spy = jest.spyOn(services.attendance, 'getAttendances')

    spy.mockClear()
    wrapper = factory()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('Table should receive attendances', async () => {
    services.attendance.getAttendances.mockResolvedValueOnce([{ id: 1 }])

    wrapper = factory()
    await flushPromises()

    expect(
      wrapper.findComponent({ ref: 'attendancesList' }).vm.items
    ).toStrictEqual([{ id: 1 }])
  })

  it('Table should receive headers', () => {
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
        text: 'Ações',
        value: 'actions'
      }
    ]

    expect(
      wrapper.findComponent({ ref: 'attendancesList' }).vm.headers
    ).toStrictEqual(headers)
  })

  it('Table should be loading during request', () => {
    wrapper = factory()

    expect(wrapper.findComponent({ ref: 'attendancesList' }).vm.loading).toBe(
      true
    )
  })

  it('Table should not be loading after response', () => {
    expect(wrapper.findComponent({ ref: 'attendancesList' }).vm.loading).toBe(
      false
    )
  })

  it('Table should contain button link to attendance', async () => {
    services.attendance.getAttendances.mockResolvedValueOnce([{ id: 1 }])

    wrapper = factory()
    await flushPromises()

    expect(wrapper.findComponent({ ref: 'attendance1' }).vm.href).toBe(
      '/atendimentos/1/editar'
    )
  })

  it('Should get attendances on customer name filter', async () => {
    const spy = jest.spyOn(services.attendance, 'getAttendances')
    spy.mockClear()

    await wrapper.find('#customer-name-filter').setValue('Anonymous999')
    wrapper.find('#customer-name-filter').trigger('keydown.enter')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      customer_name: 'Anonymous999',
      document_id: '',
      status: []
    })
  })

  it('Should get attendances on document id filter', async () => {
    const spy = jest.spyOn(services.attendance, 'getAttendances')
    spy.mockClear()

    await wrapper.find('#customer-name-filter').setValue('999')
    wrapper.find('#customer-name-filter').trigger('keydown.enter')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      customer_name: '',
      document_id: '999',
      status: []
    })
  })

  it('Should get attendances on status filter', async () => {
    services.attendance.getStatuses.mockResolvedValueOnce({
      OtherStatus: 0,
      SomeStatus: 1
    })
    const spy = jest.spyOn(services.attendance, 'getAttendances')

    wrapper = factory()
    spy.mockClear()
    await flushPromises()

    await wrapper
      .findComponent({ ref: 'statusFilter' })
      .vm.$emit('change', [0, 1])

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      customer_name: '',
      document_id: '',
      status: [0, 1]
    })
  })

  it('Should remove attendance on child component event emit', async () => {
    services.attendance.getAttendances.mockResolvedValueOnce([{ id: 1 }])
    wrapper = factory()
    await flushPromises()

    await wrapper.findComponent(AttendanceDelete).vm.$emit('delete')
    expect(wrapper.find('tbody tr').text()).toBe('No data available')
  })
})
