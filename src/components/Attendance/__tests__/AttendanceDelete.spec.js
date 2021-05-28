import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import AttendanceDelete from '@/components/Attendance/AttendanceDelete'
import AppDialogConfirm from '@/components/ui/AppDialogConfirm'
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

  beforeEach(() => {
    propsData = { attendanceId: faker.random.uuid() }
    vuetify = new Vuetify()
    wrapper = factory()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const factory = opts =>
    mount(AttendanceDelete, { Vue, vuetify, propsData, ...opts })

  it('Component should be defined', () => {
    expect(wrapper.vm).toBeDefined()
  })

  it('Icon click should show dialog component', async () => {
    await wrapper.find('#delete-icon').trigger('click')
    expect(wrapper.findComponent(AppDialogConfirm).vm.showDialog).toBe(true)
  })

  it('Confirm modal component event should close dialog', async () => {
    services.attendance.deleteAttendance.mockResolvedValue()
    await wrapper.setData({ showDialog: true })

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('confirm')
    expect(wrapper.findComponent(AppDialogConfirm).vm.showDialog).toBe(false)
  })

  it('Cancel modal component event should close dialog', async () => {
    await wrapper.setData({ showDialog: true })

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('cancel')
    expect(wrapper.findComponent(AppDialogConfirm).vm.showDialog).toBe(false)
  })

  it('Button should be loading during attendance delete request', async () => {
    services.attendance.deleteAttendance.mockResolvedValue()

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('confirm')
    expect(wrapper.findComponent({ ref: 'deleteIcon' }).vm.loading).toBe(true)
  })

  it('Button should be loading during service attendance delete request', async () => {
    services.attendance.deleteAttendance.mockResolvedValue()

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('confirm')
    await flushPromises()

    expect(wrapper.findComponent({ ref: 'deleteIcon' }).vm.loading).toBe(false)
  })

  it('Confirm modal component event emit should call service attendance delete if props is not a file instance', async () => {
    services.attendance.deleteAttendance.mockResolvedValue()
    const spy = jest.spyOn(services.attendance, 'deleteAttendance')

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('confirm')
    expect(spy).toHaveBeenCalledWith(propsData.attendanceId)
    expect(wrapper.emitted().delete).toBeTruthy()
  })

  it('Should not emit delete event if promise is rejected', async () => {
    services.attendance.deleteAttendance.mockRejectedValueOnce()

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('confirm')
    expect(wrapper.emitted().delete).toBeFalsy()
  })
})
