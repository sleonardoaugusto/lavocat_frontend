import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import AttendanceForm from '@/views/AttendanceForm'
import { mount } from '@vue/test-utils'
import faker from 'faker'
import services from '@/services'
import busy from '@/mixins/busy'
import flushPromises from 'flush-promises'
import VueTheMask from 'vue-the-mask'

jest.mock('@/services')

describe('<AttendanceForm />', () => {
  Vue.use(Vuetify)
  Vue.use(Vuelidate)
  Vue.use(VueTheMask)
  Vue.mixin(busy)

  let wrapper
  let vuetify

  const spy = jest.spyOn(services.attendance, 'create')

  beforeEach(() => {
    vuetify = new Vuetify()
    wrapper = factory()
  })

  afterEach(() => {
    spy.mockClear()
  })

  const factory = opts => mount(AttendanceForm, { Vue, vuetify, ...opts })

  test.each([
    ['customerName', null],
    ['documentId', null]
  ])('%s field must be valid', async (field, msg) => {
    expect(wrapper.findComponent({ ref: field }).vm.errorMessages).toBe(msg)
  })

  test.each([
    ['customerName', 'Campo obrigatório'],
    ['documentId', 'Campo obrigatório']
  ])('%s field must be invalid', async (field, msg) => {
    await wrapper.find('#submit').trigger('click')

    expect(wrapper.findComponent({ ref: field }).vm.errorMessages).toBe(msg)
  })

  test('#document-id field must be invalid if length', async () => {
    await wrapper.find('#document-id').setValue('9999999999')

    expect(wrapper.findComponent({ ref: 'documentId' }).vm.errorMessages).toBe(
      'Campo deve conter 11 dígitos'
    )
  })

  test.each([
    ['customer_name', { customer_name: '', document_id: '99999999999' }],
    ['document_id', { customer_name: 'maria', document_id: '' }]
  ])('Must not send form data if %s field is invalid', async (_, data) => {
    await fillForm(data)
    await wrapper.find('#submit').trigger('click')

    expect(spy).not.toHaveBeenCalled()
  })

  test('Button must be disabled during request', async () => {
    await fillForm()
    await wrapper.find('#submit').trigger('click')

    expect(wrapper.find('#submit').attributes().disabled).toBeTruthy()
  })

  test('Button must not be disabled after response', async () => {
    await fillForm()
    await wrapper.find('#submit').trigger('click')

    await flushPromises()

    expect(wrapper.find('#submit').attributes().disabled).toBeFalsy()
  })

  test('Must call service with form data', async () => {
    const data = await fillForm()

    await wrapper.find('#submit').trigger('click')

    expect(spy).toHaveBeenCalledWith({
      customer_name: data.customer_name,
      document_id: data.document_id,
      files: [data.file]
    })
  })

  const fillForm = async params => {
    const data = {
      customer_name: faker.random.word(),
      document_id: '99999999999',
      file: new File(['foo'], 'foo.png'),
      ...params
    }

    await wrapper.find('#customer-name').setValue(data.customer_name)
    await wrapper.find('#document-id').setValue(data.document_id)
    await wrapper
      .findComponent({ ref: 'files' })
      .vm.$emit('change', [data.file])

    return data
  }
})
