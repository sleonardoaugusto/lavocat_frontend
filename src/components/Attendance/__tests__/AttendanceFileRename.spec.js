import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import AttendanceFileRename from '@/components/Attendance/AttendanceFileRename'
import services from '@/services'
import faker from 'faker'
import busy from '@/mixins/busy'
import flushPromises from 'flush-promises'

jest.mock('@/services')

describe('<AttendanceFileRename />', () => {
  Vue.use(Vuetify)
  Vue.mixin(busy)

  let wrapper
  let vuetify
  let propsData

  beforeEach(() => {
    propsData = {
      file: {
        id: faker.random.uuid(),
        file: faker.random.word(),
        filename: 'filename.txt',
        attendance: faker.random.uuid()
      }
    }

    vuetify = new Vuetify()
    wrapper = factory()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const factory = opts =>
    mount(AttendanceFileRename, { Vue, vuetify, propsData, ...opts })

  it('Component should be defined', () => {
    expect(wrapper.vm).toBeDefined()
  })

  it('Dialog should not be opened', () => {
    expect(wrapper.findComponent({ ref: 'dialog' }).vm.showDialog).toBeFalsy()
  })

  it('Click should open dialog', async () => {
    await wrapper.find('#open-dialog').trigger('click')
    expect(wrapper.findComponent({ ref: 'dialog' }).vm.showDialog).toBeTruthy()
  })

  it('Cancel dialog event emit should close dialog', async () => {
    await wrapper.setData({ showDialog: true })
    await wrapper.findComponent({ ref: 'dialog' }).vm.$emit('cancel')
    expect(wrapper.findComponent({ ref: 'dialog' }).vm.showDialog).toBeFalsy()
  })

  it('Should update filename and close dialog and emit event on dialog confirm event emit', async () => {
    services.attendanceFile.updateAttendanceFile.mockResolvedValueOnce({})
    const spy = jest.spyOn(services.attendanceFile, 'updateAttendanceFile')
    await wrapper.setData({ showDialog: true })

    await wrapper
      .findComponent({ ref: 'dialog' })
      .vm.$emit('confirm', { text: 'new-name' })

    await flushPromises()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(propsData.file.id, 'new-name.txt')
    expect(
      await wrapper.findComponent({ ref: 'dialog' }).vm.showDialog
    ).toBeFalsy()
    expect(wrapper.emitted().update).toBeTruthy()
  })

  it('Should not update filename and close dialog and not emit event on dialog confirm event emit', async () => {
    services.attendanceFile.updateAttendanceFile.mockRejectedValueOnce({})
    const spy = jest.spyOn(services.attendanceFile, 'updateAttendanceFile')
    await wrapper.setData({ showDialog: true })

    await wrapper
      .findComponent({ ref: 'dialog' })
      .vm.$emit('confirm', { text: 'new-name' })

    await flushPromises()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(propsData.file.id, 'new-name.txt')
    expect(
      await wrapper.findComponent({ ref: 'dialog' }).vm.showDialog
    ).toBeFalsy()
    expect(wrapper.emitted().update).toBeFalsy()
  })
})
