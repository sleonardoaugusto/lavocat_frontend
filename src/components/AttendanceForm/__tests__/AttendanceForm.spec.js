import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import AttendanceForm from '@/components/AttendanceForm/AttendanceForm'
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

  beforeEach(() => {
    services.attendance.getStatuses.mockResolvedValue({ StatusName: 1 })
    vuetify = new Vuetify()
    wrapper = factory()
  })

  const factory = opts => mount(AttendanceForm, { Vue, vuetify, ...opts })

  describe('Validations', () => {
    test.each([
      ['customerName', null],
      ['documentId', null],
      ['statusesSelect', null]
    ])('%s field must be valid', async (field, msg) => {
      expect(wrapper.findComponent({ ref: field }).vm.errorMessages).toBe(msg)
    })

    test.each([
      ['customerName', 'Campo obrigatório'],
      ['documentId', 'Campo obrigatório'],
      ['statusesSelect', 'Campo obrigatório']
    ])('%s field must be invalid', async (field, msg) => {
      await wrapper.find('#submit').trigger('click')

      expect(wrapper.findComponent({ ref: field }).vm.errorMessages).toBe(msg)
    })

    test('#document-id field must be invalid if length', async () => {
      await wrapper.find('#document-id').setValue('9999999999')

      expect(
        wrapper.findComponent({ ref: 'documentId' }).vm.errorMessages
      ).toBe('Campo deve conter 11 dígitos')
    })
  })

  describe('Promise behavior', () => {
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
  })

  describe('Form submit', () => {
    test.each([
      [
        'customer_name',
        { customer_name: '', document_id: '99999999999', status: 1 }
      ],
      ['document_id', { customer_name: 'maria', document_id: '', status: 1 }],
      ['status', { customer_name: 'maria', document_id: '', status: null }]
    ])('Must not emit form data if %s field is invalid', async (_, data) => {
      await fillForm(data)
      await wrapper.find('#submit').trigger('click')
      const emitted = wrapper.emitted().submit

      expect(emitted).toBeUndefined()
    })

    test('Must emit form data', async () => {
      const data = await fillForm()
      await wrapper.find('#submit').trigger('click')
      const emitted = wrapper.emitted().submit[0][0]

      expect(emitted).toStrictEqual({
        customer_name: data.customer_name,
        document_id: data.document_id,
        status: data.status,
        files: [data.files]
      })
    })
  })

  describe('Update behavior', () => {
    test('Component must receive attendance statuses', async () => {
      wrapper = factory()
      await flushPromises()

      expect(
        wrapper.findComponent({ ref: 'statusesSelect' }).vm.items
      ).toStrictEqual([{ text: 'StatusName', value: 1 }])
    })

    test('Fields must receive props value', async () => {
      const data = generateData()
      await wrapper.setProps({ value: data })

      expect(wrapper.findComponent({ ref: 'customerName' }).vm.value).toBe(
        data.customer_name
      )
      expect(wrapper.findComponent({ ref: 'documentId' }).vm.value).toBe(
        data.document_id
      )
      expect(wrapper.findComponent({ ref: 'statusesSelect' }).vm.value).toBe(
        data.status
      )
      expect(wrapper.findComponent({ ref: 'files' }).vm.value).toBe(data.files)
    })
  })

  const generateData = opts => ({
    customer_name: faker.random.word(),
    document_id: '99999999999',
    status: 1,
    files: [new File(['foo'], 'foo.png')],
    ...opts
  })

  const fillForm = async params => {
    const data = generateData(params)
    await wrapper.find('#customer-name').setValue(data.customer_name)
    await wrapper.find('#document-id').setValue(data.document_id)
    await wrapper.find('#status').setValue(data.status)
    await wrapper
      .findComponent({ ref: 'files' })
      .vm.$emit('change', [data.files])

    return data
  }
})
