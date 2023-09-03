import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import VueTheMask from 'vue-the-mask'
import busy from '@/mixins/busy'
import { mount } from '@vue/test-utils'
import AttendanceFiles from '@/components/Attendance/AttendanceFiles'
import AttendanceDeleteIconFile from '@/components/Attendance/AttendanceDeleteFile'
import helpers from '@/mixins/helpers'
import { registerGlobalComponents } from '@/components/global'

jest.mock('@/services')

describe('<AttendanceFiles />', () => {
  registerGlobalComponents(Vue)
  Vue.use(Vuetify)
  Vue.use(Vuelidate)
  Vue.use(VueTheMask)
  Vue.mixin(busy)
  Vue.mixin(helpers)

  let wrapper
  let vuetify
  let stubs

  beforeEach(() => {
    vuetify = new Vuetify()
    wrapper = factory()
  })

  const factory = opts =>
    mount(AttendanceFiles, { Vue, vuetify, stubs, ...opts })

  const files = [
    new File(['fizz'], 'fizz.txt'),
    new File(['buzz'], 'buzz.txt'),
    new File(['fizzbuzz'], 'fizzbuzz.txt'),
  ]

  it('Table should list attachments', async () => {
    await wrapper
      .findComponent({ ref: 'attachments' })
      .vm.$emit('change', files)

    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })

  it('Should show download button if attachment is not a instance of File', async () => {
    await wrapper.setData({ internalFiles: [{ id: 1, file: 'link' }] })

    expect(wrapper.find('#download-0').isVisible()).toBeTruthy()
  })

  it('Should show view button if attachment is not a instance of File', async () => {
    await wrapper.setData({ internalFiles: [{ id: 1, file: 'link' }] })

    expect(wrapper.find('#view-0').isVisible()).toBeTruthy()
    expect(wrapper.find('#view-0').vm.href).toBe('link')
  })

  it('Should not show download button if attachment is a instance of File', async () => {
    await wrapper.setData({ internalFiles: [files[0]] })

    expect(wrapper.find('#download-0').isVisible()).toBeFalsy()
  })

  it('Should pass files as props to child component', async () => {
    await wrapper.setData({ internalFiles: [{ id: 1 }] })
    expect(
      wrapper.findComponent(AttendanceDeleteIconFile).vm.file,
    ).toStrictEqual({ id: 1 })
  })

  it('Should remove attachment on child component event emit', async () => {
    await wrapper.setData({ internalFiles: [{ id: 1 }] })

    await wrapper.findComponent(AttendanceDeleteIconFile).vm.$emit('delete')
    expect(wrapper.findAll('tbody tr')).toHaveLength(0)
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
      wrapper.findComponent({ ref: 'attachmentsTable' }).isVisible(),
    ).toBeTruthy()
  })

  it('Table should be hidden if do not have files to show', () => {
    expect(
      wrapper.findComponent({ ref: 'attachmentsTable' }).isVisible(),
    ).toBeFalsy()
  })
})
