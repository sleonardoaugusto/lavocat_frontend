import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import AttendanceForm from '@/views/AttendanceForm'
import { mount } from '@vue/test-utils'
import faker from 'faker'
import services from '@/services/.'
import axios from 'axios'
import busy from '@/mixins/busy'
import flushPromises from 'flush-promises'
import VueTheMask from 'vue-the-mask'

axios.post = jest.fn()

describe('<AttendanceForm />', () => {
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

  const factory = opts => mount(AttendanceForm, { Vue, vuetify, ...opts })

  test('Must render component correctly', async() => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('Page must render with one file input element', () => {
    const fileInput = '.v-file-input__text'
    expect(wrapper.findAll(fileInput)).toHaveLength(1)
  })

  test.each([['customerName', null], ['document-id', null]])('%s field must be valid', async(field, msg) => {
    expect(wrapper.findComponent({ ref: field }).vm.errorMessages).toBe(
      msg
    )
  })

  test.each([['customerName', 'Campo obrigatório'], ['document-id', 'Campo obrigatório']])('%s field must be invalid', async(field, msg) => {
    await wrapper.find('#submit').trigger('click')
    expect(wrapper.findComponent({ ref: field }).vm.errorMessages).toBe(
      msg
    )
  })

  test('Button must be disabled during request', async() => {
    services.attendance.create = jest.fn(() => Promise.resolve())
    await fillForm()
    await wrapper.find('#submit').trigger('click')
    expect(wrapper.find('#submit').attributes().disabled).toBeTruthy()
    await flushPromises()
    expect(wrapper.find('#submit').attributes().disabled).toBeFalsy()
  })

  test('Must send form data', async() => {
    const spy = jest.spyOn(services.attendance, 'create')
    spy.mockClear()
    const data = await fillForm()
    await wrapper.find('#submit').trigger('click')
    expect(spy).toHaveBeenCalledWith({
      customer_name: data.customer_name,
      document_id: data.document_id,
      files: [data.file]
    })
  })

  const fillForm = async() => {
    const data = {
      customer_name: faker.random.word(),
      document_id: '99999999999',
      file: new File(['foo'], 'foo.png')
    }
    await wrapper.find('#customer-name').setValue(data.customer_name)
    await wrapper.find('#document-id').setValue(data.document_id)
    await wrapper.findComponent({ ref: 'files' }).vm.$emit('change', [data.file])
    return data
  }
})
