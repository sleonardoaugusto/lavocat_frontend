import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import AppDeleteIcon from '@/components/ui/AppDeleteIcon'
import services from '@/services'
import faker from 'faker'
import busy from '@/mixins/busy'
import AppDialogConfirm from '@/components/ui/AppDialogConfirm'

jest.mock('@/services')

describe('<AppDeleteIcon />', () => {
  Vue.use(Vuetify)
  Vue.mixin(busy)

  let wrapper
  let vuetify
  let propsData

  beforeEach(() => {
    propsData = {
      dialogTitle: faker.random.word(),
      dialogText: faker.random.word()
    }
    vuetify = new Vuetify()
    wrapper = factory()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const factory = opts =>
    mount(AppDeleteIcon, { Vue, vuetify, propsData, ...opts })

  it('Component should be defined', () => {
    expect(wrapper.vm).toBeDefined()
  })

  it('Dialog text prop should be passed to dialog component', async () => {
    expect(wrapper.findComponent(AppDialogConfirm).vm.title).toBe(
      propsData.dialogTitle
    )
  })

  it('Dialog text prop should be passed to dialog component', async () => {
    expect(wrapper.findComponent(AppDialogConfirm).vm.text).toBe(
      propsData.dialogText
    )
  })

  it('Icon click should show dialog component', async () => {
    await wrapper.find('#delete-icon').trigger('click')
    expect(wrapper.findComponent(AppDeleteIcon).vm.showDialog).toBe(true)
  })

  it('Confirm modal component event should close dialog and emit event', async () => {
    services.attendance.deleteAttendance.mockResolvedValue()
    await wrapper.setData({ showDialog: true })

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('confirm')
    expect(wrapper.findComponent(AppDialogConfirm).vm.showDialog).toBe(false)
    expect(wrapper.emitted().delete).toHaveLength(1)
  })

  it('Cancel modal component event should close dialog and not emit event', async () => {
    await wrapper.setData({ showDialog: true })

    await wrapper.findComponent(AppDialogConfirm).vm.$emit('cancel')
    expect(wrapper.findComponent(AppDialogConfirm).vm.showDialog).toBe(false)
    expect(wrapper.emitted().delete).toBeFalsy()
  })

  it('Button should be loading if loading props is truthy', async () => {
    await wrapper.setProps({ loading: true })
    expect(wrapper.findComponent({ ref: 'deleteIcon' }).vm.loading).toBe(true)
  })

  it('Button should not be loading if loading props is falsy', async () => {
    await wrapper.setProps({ loading: false })
    expect(wrapper.findComponent({ ref: 'deleteIcon' }).vm.loading).toBe(false)
  })
})
