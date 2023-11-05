import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import ServicesOptions from '@/components/Attendance/ServicesOptions'

describe('<ServicesOptions />', () => {
  Vue.use(Vuetify)

  let wrapper
  let vuetify
  let propsData

  beforeEach(() => {
    propsData = { selected: [] }
    vuetify = new Vuetify()
    wrapper = factory()
  })

  const factory = opts =>
    mount(ServicesOptions, { Vue, vuetify, propsData, ...opts })

  it('Component should be defined', () => {
    expect(wrapper.vm).toBeDefined()
  })

  it('Component should render items correctly', () => {
    expect(
      wrapper.findComponent({ ref: 'servicesOptions' }).vm.items,
    ).toStrictEqual([
      { value: 'DPVAT', text: 'DPVAT' },
      { value: 'AUXILIO_DOENCA', text: 'Auxílio Doença' },
      { value: 'AUXILIO_ACIDENTE', text: 'Auxílio Acidente' },
      { value: 'LOAS', text: 'LOAS' },
      { value: 'APOSENTADORIA', text: 'Aposentadoria' },
      { value: 'ACAO_INDENIZATORIA', text: 'Ação Indenizatória' },
      { value: 'ACAO_TRABALHISTA', text: 'Ação Trabalhista' },
      { value: 'ACAO_PREVIDENCIARIA', text: 'Ação Previdenciária' },
      { value: 'SEGURO_DE_VIDA_PROPRIO', text: 'Seguro de Vida Próprio' },
      { value: 'SEGURO_CONDUTOR', text: 'Seguro Condutor' },
      {
        value: 'SEGURO_DE_VIDA_EMPRESARIAL',
        text: 'Seguro de Vida Empresarial',
      },
      {
        value: 'PENSAO_POR_MORTE',
        text: 'Pensão por Morte',
      },
    ])
  })

  it('Component should emit event when a new item is selected', async () => {
    await wrapper
      .findComponent({ ref: 'servicesOptions' })
      .vm.$emit('input', [{ value: 'DPVAT', text: 'DPVAT' }])
    expect(wrapper.emitted().changed).toBeTruthy()
    expect(wrapper.emitted().changed).toHaveLength(1)
    expect(wrapper.emitted().changed[0][0]).toStrictEqual(['DPVAT'])
  })

  it('Component should render selected items received by props', async () => {
    await wrapper.setProps({ selected: ['DPVAT'] })
    expect(
      wrapper.findComponent({ ref: 'servicesOptions' }).vm.selectedItems,
    ).toStrictEqual([{ value: 'DPVAT', text: 'DPVAT' }])
  })
})
