import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import AppDialogConfirm from '@/components/ui/AppDialogConfirm'

describe('<AppDialogConfirm />', () => {
  Vue.use(Vuetify)

  let wrapper
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    wrapper = factory()
  })

  const factory = opts => mount(AppDialogConfirm, { Vue, vuetify, ...opts })

  it('Component should be defined', () => {
    expect(wrapper.vm).toBeDefined()
  })

  it('Should open dialog if props is true', async () => {
    await wrapper.setProps({ showDialog: true })
    expect(wrapper.find('.v-dialog__content').element).toBeDefined()
  })

  it('Should not open dialog if props is false', async () => {
    await wrapper.setProps({ showDialog: false })
    expect(wrapper.find('.v-dialog__content').element).toBeUndefined()
  })

  it('Confirm button click should confirm emit event', async () => {
    await wrapper.setProps({ showDialog: true })

    await wrapper.find('#confirm').trigger('click')
    expect(wrapper.emitted().confirm).toBeTruthy()
  })

  it('Cancel button click should cancel emit event', async () => {
    await wrapper.setProps({ showDialog: true })

    await wrapper.find('#cancel').trigger('click')
    expect(wrapper.emitted().cancel).toBeTruthy()
  })

  it('ESC keydown should emit cancel event', async () => {
    await wrapper.setProps({ showDialog: true })

    await wrapper.find('.v-dialog').trigger('keydown.esc')
    expect(wrapper.emitted().cancel).toBeTruthy()
  })
})
