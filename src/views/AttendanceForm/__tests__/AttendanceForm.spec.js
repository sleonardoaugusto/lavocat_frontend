import Vue from 'vue'
import Vuetify from 'vuetify'
import AttendanceForm from '@/views/AttendanceForm'
import { mount } from '@vue/test-utils'
import faker from 'faker'
import services from '@/services/.'
import axios from 'axios'

axios.post = jest.fn()

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

  test('Must send form data', async() => {
    const spy = jest.spyOn(services.auth, 'create')
    const data = await fillForm()
    await wrapper.find('#submit').trigger('click')
    expect(spy).toHaveBeenCalledWith({
      name: data.name,
      document_id: data.document_id,
      attachments: [data.file]
    })
  })

  const fillForm = async() => {
    const data = {
      name: faker.random.word(),
      document_id: faker.random.number(),
      file: new File(['foo'], 'foo.png')
    }
    await wrapper.find('#name').setValue(data.name)
    await wrapper.find('#document-id').setValue(data.document_id)
    await wrapper.findComponent({ ref: 'attachment-0' }).vm.$emit('change', data.file)

    return data
  }
})
