import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueTheMask from 'vue-the-mask'
import busy from '@/mixins/busy'
import { mount } from '@vue/test-utils'
import AttendanceFiles from '@/components/Attendance/AttendanceFiles'
import services from '@/services'
import flushPromises from 'flush-promises'

jest.mock('@/services')

describe('<AttendanceFiles />', () => {
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

  const factory = opts => mount(AttendanceFiles, { Vue, vuetify, ...opts })

  const files = [
    new File(['fizz'], 'fizz.txt'),
    new File(['buzz'], 'buzz.txt'),
    new File(['fizzbuzz'], 'fizzbuzz.txt')
  ]

  it('Table should list attachments', async () => {
    await wrapper
      .findComponent({ ref: 'attachments' })
      .vm.$emit('change', files)

    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })

  it('Should remove attachment', async () => {
    await wrapper
      .findComponent({ ref: 'attachments' })
      .vm.$emit('change', files)
    await wrapper.find('#remove-2').trigger('click')

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('Should show if attachment is not a instance of File', async () => {
    await wrapper.setData({ internalFiles: [{ id: 1, file: 'link' }] })

    expect(wrapper.find('#download-0').isVisible()).toBeTruthy()
    expect(wrapper.find('#download-0').vm.href).toBe('link')
  })

  it('Should not show if attachment is a instance of File', async () => {
    await wrapper.setData({ internalFiles: [files[0]] })

    expect(wrapper.find('#download-0').isVisible()).toBeFalsy()
  })

  it('Should not call delete file service if is not instance of File', async () => {
    const spy = jest.spyOn(services.attendance, 'deleteAttendanceFile')
    await wrapper.setData({ internalFiles: [files[0]] })

    await wrapper.find('#remove-0').trigger('click')

    expect(spy).not.toHaveBeenCalled()
  })

  it('Should call delete file service if is instance of File', async () => {
    services.attendance.deleteAttendanceFile.mockResolvedValue()
    const spy = jest.spyOn(services.attendance, 'deleteAttendanceFile')
    await wrapper.setData({ internalFiles: [{ id: 1 }] })

    await wrapper.find('#remove-0').trigger('click')

    expect(spy).toHaveBeenCalledWith(1)
  })

  it('Should not remove attachment if promise is rejected', async () => {
    services.attendance.deleteAttendanceFile.mockRejectedValueOnce()
    await wrapper.setData({ internalFiles: [{ id: 1 }] })

    await wrapper.find('#remove-0').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
  })

  it('Should remove attachment if promise is resolved', async () => {
    services.attendance.deleteAttendanceFile.mockResolvedValue()
    await wrapper.setData({ internalFiles: [{ id: 1 }] })

    await wrapper.find('#remove-0').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('tbody tr')).toHaveLength(0)
  })

  it('Button must be loading during delete file request promise', async () => {
    await wrapper.setData({ internalFiles: [{ id: 1 }] })

    await wrapper.find('#remove-0').trigger('click')

    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.findComponent({ ref: 'remove-0' }).vm.loading).toBeTruthy()
  })

  it('Button must not be loading after delete file request promise', async () => {
    services.attendance.deleteAttendanceFile.mockRejectedValueOnce()
    await wrapper.setData({ internalFiles: [{ id: 1 }] })

    await wrapper.find('#remove-0').trigger('click')
    await flushPromises()

    expect(wrapper.findComponent({ ref: 'remove-0' }).vm.loading).toBeFalsy()
  })

  it('Should add new files to existent files', async () => {
    await wrapper.setData({ internalFiles: [files[0]] })

    const file = new File(['buzzfizz'], 'buzzfizz.txt')
    await wrapper
      .findComponent({ ref: 'attachments' })
      .vm.$emit('change', [file])

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('Should emit files on change', async () => {
    const file = new File(['buzzfizz'], 'buzzfizz.txt')
    await wrapper
      .findComponent({ ref: 'attachments' })
      .vm.$emit('change', [file])

    expect(wrapper.emitted().changed).toBeTruthy()
    expect(wrapper.emitted().changed).toHaveLength(1)
    expect(wrapper.emitted().changed[0][0]).toStrictEqual([file])
  })

  it('Should not set props if last value is equal of data', async () => {
    const spy = jest.spyOn(wrapper.vm, 'setInternal')
    await wrapper.setData({ internalFiles: [files[0]] })
    await wrapper.setProps({ value: [files[0]] })

    expect(spy).not.toHaveBeenCalled()
  })

  it('Should set props if last value is not the equal of data', async () => {
    const spy = jest.spyOn(wrapper.vm, 'setInternal')
    await wrapper.setProps({ value: [{}] })

    expect(spy).toHaveBeenCalledWith([{}])
  })

  it('Table should be visible if have files to show', async () => {
    await wrapper.setData({ internalFiles: files })

    expect(
      wrapper.findComponent({ ref: 'attachmentsTable' }).isVisible()
    ).toBeTruthy()
  })

  it('Table should be hidden if do not have files to show', () => {
    expect(
      wrapper.findComponent({ ref: 'attachmentsTable' }).isVisible()
    ).toBeFalsy()
  })
})
