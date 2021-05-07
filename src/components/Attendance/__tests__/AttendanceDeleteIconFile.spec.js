import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import AttendanceDeleteIconFile from '@/components/Attendance/AttendanceDeleteIconFile'
import AppDialogConfirm from '@/components/ui/AppDialogConfirm'
import services from '@/services'
import faker from 'faker'
import busy from '@/mixins/busy'
import flushPromises from 'flush-promises'

jest.mock('@/services')

describe('<AttendanceDeleteIconFile />', () => {
  Vue.use(Vuetify)
  Vue.mixin(busy)

  let wrapper
  let vuetify
  let propsData

  beforeEach(() => {
    propsData = { file: { id: faker.random.uuid() } }
    vuetify = new Vuetify()
    wrapper = factory()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const factory = opts =>
    mount(AttendanceDeleteIconFile, { Vue, vuetify, propsData, ...opts })

  it('Component should be defined', () => {
    expect(wrapper.vm).toBeDefined()
  })

  it('Icon click should show dialog component', async () => {
    await wrapper.find('#delete-icon').trigger('click')
    expect(wrapper.findComponent(AppDialogConfirm).vm.showDialog).toBe(true)
  })

  it('Confirm modal component event should close dialog', async () => {
    services.attendance.deleteAttendanceFile.mockResolvedValue()
    await wrapper.setData({ showDialog: true })

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('confirm')
    expect(wrapper.findComponent(AppDialogConfirm).vm.showDialog).toBe(false)
  })

  it('Cancel modal component event should close dialog', async () => {
    await wrapper.setData({ showDialog: true })

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('cancel')
    expect(wrapper.findComponent(AppDialogConfirm).vm.showDialog).toBe(false)
  })

  it('Button should be loading during service delete file request', async () => {
    services.attendance.deleteAttendanceFile.mockResolvedValue()

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('confirm')
    expect(wrapper.findComponent({ ref: 'deleteIcon' }).vm.loading).toBe(true)
  })

  it('Button should be loading during service delete file request', async () => {
    services.attendance.deleteAttendanceFile.mockResolvedValue()

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('confirm')
    await flushPromises()

    expect(wrapper.findComponent({ ref: 'deleteIcon' }).vm.loading).toBe(false)
  })

  it('Confirm modal component event emit should call service file delete if props is not a file instance', async () => {
    services.attendance.deleteAttendanceFile.mockResolvedValue()
    const spy = jest.spyOn(services.attendance, 'deleteAttendanceFile')

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('confirm')
    expect(spy).toHaveBeenCalledWith(propsData.file.id)
    expect(wrapper.emitted().delete).toBeTruthy()
  })

  it('Confirm modal component event emit should not call service file delete if props is a file instance', async () => {
    const spy = jest.spyOn(services.attendance, 'deleteAttendanceFile')
    await wrapper.setProps({ file: new File(['buzzfizz'], 'buzzfizz.txt') })

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('confirm')
    expect(spy).not.toHaveBeenCalled()
    expect(wrapper.emitted().delete).toBeTruthy()
  })

  it('Should not emit delete event if promise is rejected', async () => {
    services.attendance.deleteAttendanceFile.mockRejectedValueOnce()

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('confirm')
    expect(wrapper.emitted().delete).toBeFalsy()
  })
})
