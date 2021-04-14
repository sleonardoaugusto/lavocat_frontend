import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import { mount } from '@vue/test-utils'
import Login from '@/views/Login'
import services from '@/services'
import faker from 'faker'
import busy from '@/mixins/busy'
import flushPromises from 'flush-promises'

jest.mock('@/services')
jest.mock('@/router')

describe('<Login />', () => {
  Vue.use(Vuetify)
  Vue.use(Vuelidate)
  Vue.mixin(busy)

  let wrapper
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    wrapper = factory()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const factory = opts => mount(Login, { Vue, vuetify, ...opts })

  describe('Validations', () => {
    test.each([['username'], ['password']])(
      '%s field validation state must be null',
      async field => {
        expect(
          wrapper.findComponent({ ref: field }).vm.errorMessages
        ).toBeNull()
      }
    )

    test.each([
      ['username', 'Campo obrigatório'],
      ['password', 'Campo obrigatório']
    ])('%s field must be valid', async (field, msg) => {
      await wrapper.find('#submit').trigger('click')

      expect(wrapper.findComponent({ ref: field }).vm.errorMessages).toBe(msg)
    })
  })

  describe('Submit', () => {
    test('Should call service if form is valid', async () => {
      const spy = jest.spyOn(services.auth, 'login')

      const data = await fillForm()
      await wrapper.find('#submit').trigger('click')

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(data)
    })

    test('Should not call service if form is not valid', async () => {
      const spy = jest.spyOn(services.auth, 'login')

      await wrapper.find('#submit').trigger('click')

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('Async behavior', () => {
    test('Button must be loading during request', async () => {
      await fillForm()

      await wrapper.find('#submit').trigger('click')

      expect(wrapper.findComponent({ ref: 'submitBtn' }).vm.loading).toBe(true)
    })

    test('Button must not be loading after request', async () => {
      await fillForm()

      await wrapper.find('#submit').trigger('click')
      await flushPromises()

      expect(wrapper.findComponent({ ref: 'submitBtn' }).vm.loading).toBe(false)
    })
  })

  const fillForm = async () => {
    const data = {
      username: faker.random.word(),
      password: faker.random.word()
    }
    await wrapper
      .findComponent({ ref: 'username' })
      .vm.$emit('input', data.username)
    await wrapper
      .findComponent({ ref: 'password' })
      .vm.$emit('input', data.password)

    return data
  }
})
