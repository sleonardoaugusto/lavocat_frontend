import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import AttendanceForm from '@/components/Attendance/AttendanceForm'
import { mount } from '@vue/test-utils'
import faker from 'faker'
import services from '@/services'
import busy from '@/mixins/busy'
import flushPromises from 'flush-promises'
import VueTheMask from 'vue-the-mask'
import helpers from '@/mixins/helpers'
import { registerGlobalComponents } from '@/components/global'

jest.mock('@/services')

describe('<AttendanceForm />', () => {
  registerGlobalComponents(Vue)
  Vue.use(Vuetify)
  Vue.use(Vuelidate)
  Vue.use(VueTheMask)
  Vue.mixin(busy)
  Vue.mixin(helpers)

  let wrapper
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    wrapper = factory()
  })

  const factory = opts => mount(AttendanceForm, { Vue, vuetify, ...opts })

  it('Previous button', () => {
    expect(wrapper.findComponent({ ref: 'previousBtn' }).vm.$props.href).toBe(
      '/atendimentos',
    )
  })

  describe('Validations', () => {
    test.each([['customerName'], ['documentId'], ['source']])(
      '%s field validation state should be null',
      async field => {
        expect(
          wrapper.findComponent({ ref: field }).vm.errorMessages,
        ).toBeNull()
      },
    )

    test.each([
      ['customerName', 'Campo obrigatório'],
      ['documentId', null],
      ['source', 'Campo obrigatório'],
    ])('%s field should be %s', async (field, msg) => {
      await wrapper.find('#submit').trigger('click')

      expect(wrapper.findComponent({ ref: field }).vm.errorMessages).toBe(msg)
    })

    it('#document-id field should be invalid if length is not 11', async () => {
      await wrapper.find('#document-id').setValue('9999999999')

      expect(
        wrapper.findComponent({ ref: 'documentId' }).vm.errorMessages,
      ).toBe('Campo deve conter 11 dígitos')
    })
  })

  describe('Promise behavior', () => {
    it('Button and overlay should not be loading', async () => {
      expect(wrapper.findComponent({ ref: 'submitBtn' }).vm.loading).toBeFalsy()
      expect(wrapper.findComponent({ ref: 'overlay' }).vm.value).toBeFalsy()
    })

    it('Button and overlay should be loading', async () => {
      await wrapper.setProps({ busy: true })

      expect(
        wrapper.findComponent({ ref: 'submitBtn' }).vm.loading,
      ).toBeTruthy()
      expect(wrapper.findComponent({ ref: 'overlay' }).vm.value).toBeTruthy()
    })
  })

  describe('Form submit', () => {
    it('Should not emit form data if customer_name field is invalid', async () => {
      await fillForm({ customer_name: '' })
      await wrapper.find('#submit').trigger('click')

      expect(wrapper.emitted().submit).toBeFalsy()
    })

    it('Should emit form data', async () => {
      const data = await fillForm()
      await wrapper.find('#submit').trigger('click')

      expect(wrapper.emitted().submit).toBeTruthy()
      expect(wrapper.emitted().submit).toHaveLength(1)
      expect(wrapper.emitted().submit[0][0]).toStrictEqual({
        customer_name: data.customer_name,
        document_id: data.document_id,
        source: data.source,
        files: data.files,
        resume: data.resume,
        status_resume: data.status_resume,
        services_types: ['DPVAT'],
      })
    })
  })

  describe('Update behavior', () => {
    test.each([
      ['Salvar', true],
      ['Cadastrar', false],
    ])('Button label should be %s if update is %s', (label, flag) => {
      wrapper = factory({ propsData: { update: flag } })

      expect(wrapper.find('#submit').text()).toBe(label)
    })

    it('Component should emit passed props only once to avoid infinite loop', async () => {
      await wrapper.setData({ form: { files: [{}] } })

      expect(
        wrapper.findComponent({ ref: 'attachments' }).emitted().changed[0],
      ).toHaveLength(1)
    })

    it('Fields should receive props value', async () => {
      const data = generateData()
      wrapper = factory({ propsData: { update: true } })
      await wrapper.setProps({ value: data })

      expect(wrapper.findComponent({ ref: 'customerName' }).vm.value).toBe(
        data.customer_name,
      )
      expect(wrapper.findComponent({ ref: 'documentId' }).vm.value).toBe(
        data.document_id_formatted,
      )
      expect(
        wrapper.findComponent({ ref: 'servicesOptions' }).vm.selected,
      ).toStrictEqual(data.services_types)
      expect(
        wrapper.findComponent({ ref: 'attachments' }).vm.value,
      ).toStrictEqual(data.files)
      expect(wrapper.findComponent({ ref: 'resume' }).vm.value).toBe(
        data.resume,
      )
      expect(wrapper.findComponent({ ref: 'statusResume' }).vm.value).toBe(
        data.status_resume,
      )
    })
  })

  const generateData = opts => ({
    customer_name: faker.random.word(),
    document_id: '99999999999',
    document_id_formatted: '999.999.999-99',
    services_types: ['DPVAT'],
    source: faker.random.word(),
    files: [new File(['foo'], 'foo.png')],
    resume: faker.random.word(),
    status_resume: faker.random.word(),
    ...opts,
  })

  const fillForm = async params => {
    const data = generateData(params)

    await wrapper.find('#customer-name').setValue(data.customer_name)
    await wrapper.find('#document-id').setValue(data.document_id)
    await wrapper
      .findComponent({ ref: 'servicesOptions' })
      .vm.$emit('changed', data.services_types)
    await wrapper.find('#source').setValue(data.source)
    await wrapper
      .findComponent({ ref: 'attachments' })
      .vm.$emit('changed', data.files)
    await wrapper.find('#resume').setValue(data.resume)
    await wrapper.find('#status-resume').setValue(data.status_resume)

    return data
  }
})
