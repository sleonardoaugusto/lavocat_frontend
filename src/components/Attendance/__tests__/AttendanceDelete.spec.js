import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import AttendanceDelete from '@/components/Attendance/AttendanceDelete'
import AppDeleteIcon from '@/components/ui/AppDeleteIcon'
import services from '@/services'
import faker from 'faker'
import busy from '@/mixins/busy'
import flushPromises from 'flush-promises'

jest.mock('@/services')

describe('<AttendanceDelete />', () => {
  Vue.use(Vuetify)
  Vue.mixin(busy)

  let wrapper
  let vuetify
  let propsData
  let stubs

  beforeEach(() => {
    stubs = { AppDeleteIcon: true }
    propsData = { attendanceId: faker.random.uuid() }
    vuetify = new Vuetify()
    wrapper = factory()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const factory = opts =>
    mount(AttendanceDelete, { Vue, vuetify, propsData, stubs, ...opts })

  it('Component should be defined', () => {
    expect(wrapper.vm).toBeDefined()
  })

  it('Component should be loading during attendance delete request', async () => {
    services.attendance.deleteAttendance.mockResolvedValue()

    await wrapper.findComponent(AppDeleteIcon).vm.$emit('delete')
    expect(wrapper.findComponent(AppDeleteIcon).vm.loading).toBe(true)
  })

  it('Component should not be loading after service attendance delete request', async () => {
    services.attendance.deleteAttendance.mockResolvedValue()

    await wrapper.findComponent(AppDeleteIcon).vm.$emit('delete')
    await flushPromises()

    expect(wrapper.findComponent(AppDeleteIcon).vm.loading).toBe(false)
  })

  it('Component event emit should delete attendance', async () => {
    services.attendance.deleteAttendance.mockResolvedValue()
    const spy = jest.spyOn(services.attendance, 'deleteAttendance')

    await wrapper.findComponent(AppDeleteIcon).vm.$emit('delete')
    expect(spy).toHaveBeenCalledWith(propsData.attendanceId)
    expect(wrapper.emitted().delete).toBeTruthy()
  })

  it('Should not emit delete event if promise is rejected', async () => {
    services.attendance.deleteAttendance.mockRejectedValueOnce()

    await wrapper.findComponent(AppDeleteIcon).vm.$emit('delete')
    expect(wrapper.emitted().delete).toBeFalsy()
  })
})
