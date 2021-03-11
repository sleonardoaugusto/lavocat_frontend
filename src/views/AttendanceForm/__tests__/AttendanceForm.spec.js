import Vue from 'vue'
import Vuetify from 'vuetify'
import AttendanceForm from '@/views/AttendanceForm/index'
import { mount } from '@vue/test-utils'

describe('<AttendanceForm />', () => {
  Vue.use(Vuetify)
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

  test.each([['#name'], ['#cpf'], ['#add-document']])('Must contain %s element', (id) => {
    expect(wrapper.find(id).element).toBeTruthy()
  })

  test('Page must render with one file input element', () => {
    const fileInput = '.v-file-input__text'
    expect(wrapper.findAll(fileInput)).toHaveLength(1)
  })

  test('Button must add file input element', async() => {
    await wrapper.find('#add-document').trigger('click')
    const fileInput = '.v-file-input__text'
    expect(wrapper.findAll(fileInput)).toHaveLength(2)
  })

  test('Button must remove file input element', async() => {
    await wrapper.find('#remove-document').trigger('click')
    const fileInput = '.v-file-input__text'
    expect(wrapper.findAll(fileInput)).toHaveLength(0)
  })
})
