import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import AttendanceDeleteFile from '@/components/Attendance/AttendanceDeleteFile'
import services from '@/services'
import faker from 'faker'
import busy from '@/mixins/busy'
import flushPromises from 'flush-promises'
import AppDeleteIcon from '@/components/ui/AppDeleteIcon'

jest.mock('@/services')

describe('<AttendanceDeleteFile />', () => {
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
    mount(AttendanceDeleteFile, { Vue, vuetify, propsData, ...opts })

  it('Component should be defined', () => {
    expect(wrapper.vm).toBeDefined()
  })

  it('Component should be loading during attendance delete request', async () => {
    services.attendance.deleteAttendanceFile.mockResolvedValue()

    await wrapper.findComponent(AppDeleteIcon).vm.$emit('delete')
    expect(wrapper.findComponent(AppDeleteIcon).vm.loading).toBe(true)
  })

  it('Component should not be loading after service attendance delete request', async () => {
    services.attendance.deleteAttendanceFile.mockResolvedValue()

    await wrapper.findComponent(AppDeleteIcon).vm.$emit('delete')
    await flushPromises()

    expect(wrapper.findComponent(AppDeleteIcon).vm.loading).toBe(false)
  })

  it('Confirm modal component event emit should call service file delete if props is not a file instance', async () => {
    services.attendance.deleteAttendanceFile.mockResolvedValue()
    const spy = jest.spyOn(services.attendance, 'deleteAttendanceFile')

    await wrapper.findComponent(AppDeleteIcon).vm.$emit('delete')
    expect(spy).toHaveBeenCalledWith(propsData.file.id)
    expect(wrapper.emitted().delete).toBeTruthy()
  })

  it('Component event emit should not call service file delete if props is a file instance', async () => {
    const spy = jest.spyOn(services.attendance, 'deleteAttendanceFile')
    await wrapper.setProps({ file: new File(['buzzfizz'], 'buzzfizz.txt') })

    await wrapper.findComponent(AppDeleteIcon).vm.$emit('delete')
    expect(spy).not.toHaveBeenCalled()
    expect(wrapper.emitted().delete).toBeTruthy()
  })

  it('Should not emit delete event if promise is rejected', async () => {
    services.attendance.deleteAttendanceFile.mockRejectedValueOnce()

    await wrapper.findComponent(AppDeleteIcon).vm.$emit('delete')
    expect(wrapper.emitted().delete).toBeFalsy()
  })
})
