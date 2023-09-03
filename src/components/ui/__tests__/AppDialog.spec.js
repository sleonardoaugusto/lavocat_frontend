import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import AppDialog from '@/components/ui/AppDialog'
import faker from 'faker'

describe('<AppDialog />', () => {
  Vue.use(Vuetify)

  let wrapper
  let vuetify
  let propsData

  beforeEach(() => {
    propsData = {
      title: faker.lorem.words(),
      text: faker.lorem.words(),
    }
    vuetify = new Vuetify()
    wrapper = factory()
  })

  const factory = opts => mount(AppDialog, { Vue, vuetify, propsData, ...opts })

  it('Component should be defined', () => {
    expect(wrapper.vm).toBeDefined()
  })

  it('Should render title props', async () => {
    await showDialog()
    expect(wrapper.find('.v-card__title').text()).toBe(propsData.title)
  })

  it('Should render text props', async () => {
    await showDialog()
    expect(wrapper.find('.v-card__text').text()).toBe(propsData.text)
  })

  it.each([
    ['cancelar', {}],
    ['não', { btnCancelTxt: 'não' }],
  ])('Cancel button text should be %s', async (text, props) => {
    await wrapper.setProps(props)
    await showDialog()
    expect(wrapper.find('#cancel').text()).toBe(text)
  })

  it.each([
    ['confirmar', {}],
    ['sim', { btnConfirmTxt: 'sim' }],
  ])('Confirm button text should be %s', async (text, props) => {
    await wrapper.setProps(props)
    await showDialog()
    expect(wrapper.find('#confirm').text()).toBe(text)
  })

  it('Should render default confirm button text', async () => {
    await showDialog()
    expect(wrapper.find('#confirm').text()).toBe('confirmar')
  })

  it('Should open dialog if props is true', async () => {
    await showDialog()
    expect(wrapper.find('.v-dialog__content').element).toBeDefined()
  })

  it('Should not open dialog if props is false', async () => {
    await wrapper.setProps({ showDialog: false })
    expect(wrapper.find('.v-dialog__content').element).toBeUndefined()
  })

  it('Confirm button click should confirm emit event', async () => {
    await showDialog()
    await wrapper.find('#confirm').trigger('click')
    expect(wrapper.emitted().confirm).toBeTruthy()
  })

  it('Cancel button click should cancel emit event', async () => {
    await showDialog()
    await wrapper.find('#cancel').trigger('click')
    expect(wrapper.emitted().cancel).toBeTruthy()
  })

  it('ESC keydown should emit cancel event', async () => {
    await showDialog()
    await wrapper.find('.v-dialog').trigger('keydown.esc')
    expect(wrapper.emitted().cancel).toBeTruthy()
  })

  it('Should render fields', async () => {
    await wrapper.setProps({
      fields: [
        {
          component: 'v-text-field',
          attrs: { label: 'Nome do arquivo' },
          model: 'text',
          value: 'hi',
        },
      ],
    })
    await showDialog()
    expect(wrapper.findComponent({ ref: 'field-0' }).vm).toBeDefined()
  })

  const showDialog = () => {
    wrapper.setProps({ showDialog: true })
  }
})
