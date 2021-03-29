import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueTheMask from 'vue-the-mask'
import busy from '@/mixins/busy'
import { mount } from '@vue/test-utils'
import AttendanceFiles from '@/components/Attendance/AttendanceFiles'
import services from '@/services'

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

  test('Table must list attachments', async () => {
    await wrapper
      .findComponent({ ref: 'attachments' })
      .vm.$emit('change', files)

    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })

  test('Must remove attachment', async () => {
    await wrapper
      .findComponent({ ref: 'attachments' })
      .vm.$emit('change', files)
    await wrapper.find('#remove-2').trigger('click')

    expect(wrapper.html()).not.toContain('fizzbuzz')
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  test('Must show if attachment is not a instance of File', async () => {
    await wrapper.setData({ internalFiles: [{ id: 1, file: 'link' }] })

    expect(wrapper.find('#download-0').isVisible()).toBeTruthy()
    expect(wrapper.find('#download-0').vm.href).toBe('link')
  })

  test('Must not show if attachment is a instance of File', async () => {
    await wrapper.setData({ internalFiles: [files[0]] })

    expect(wrapper.find('#download-0').isVisible()).toBeFalsy()
  })

  test('Must not call service if is not instance of File', async () => {
    const spy = jest.spyOn(services.attendance, 'deleteAttendanceFile')
    await wrapper.setData({ internalFiles: [files[0]] })

    await wrapper.find('#remove-0').trigger('click')

    expect(spy).not.toHaveBeenCalled()
  })

  test('Must call service if is instance of File', async () => {
    const spy = jest.spyOn(services.attendance, 'deleteAttendanceFile')
    await wrapper.setData({ internalFiles: [{ id: 1 }] })

    await wrapper.find('#remove-0').trigger('click')

    expect(spy).toHaveBeenCalledWith(1)
  })

  test('Must add new files to existent files', async () => {
    await wrapper.setData({ internalFiles: [files[0]] })

    const file = new File(['buzzfizz'], 'buzzfizz.txt')
    await wrapper
      .findComponent({ ref: 'attachments' })
      .vm.$emit('change', [file])

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  test('Must emit files on change', async () => {
    const file = new File(['buzzfizz'], 'buzzfizz.txt')
    await wrapper
      .findComponent({ ref: 'attachments' })
      .vm.$emit('change', [file])

    expect(wrapper.emitted().changed).toBeTruthy()
    expect(wrapper.emitted().changed).toHaveLength(1)
    expect(wrapper.emitted().changed[0][0]).toStrictEqual([file])
  })

  test('Table must list files received by props', async () => {
    const file = new File(['buzzfizz'], 'buzzfizz.txt')
    await wrapper.setProps({ value: [file] })

    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
  })

  test('Table must be visible if have files to show', async () => {
    await wrapper.setData({ internalFiles: files })

    expect(
      wrapper.findComponent({ ref: 'attachmentsTable' }).isVisible()
    ).toBeTruthy()
  })

  test('Table must be hidden if do not have files to show', async () => {
    expect(
      wrapper.findComponent({ ref: 'attachmentsTable' }).isVisible()
    ).toBeFalsy()
  })
})
