import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import AttendanceNotesSection from '@/components/Attendance/AttendanceNotesSection'
import services from '@/services'
import flushPromises from 'flush-promises'

jest.mock('@/services')

describe.skip('<AttendanceNotesSection />', () => {
  Vue.use(Vuetify)

  let wrapper
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    wrapper = factory()
  })

  const factory = opts =>
    mount(AttendanceNotesSection, { Vue, vuetify, ...opts })

  describe('Component mounted with attendanceId route props', () => {
    const attendanceId = 1
    const mockedRoute = {
      $route: {
        params: {
          attendanceId,
        },
      },
    }
    const firstNote = { id: 1, header: 'Title 1', content: 'Text' }
    const secondNote = { id: 2, header: 'Title 2', content: 'Text 2' }

    beforeEach(async () => {
      services.notes.getNotes.mockResolvedValueOnce([firstNote, secondNote])
      wrapper = await factory({ mocks: mockedRoute })
      await flushPromises()
      jest.clearAllMocks()
    })

    it('Service should be called with attendaceId', () => {
      const spy = jest.spyOn(services.notes, 'getNotes')

      wrapper = factory({ mocks: mockedRoute })

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(attendanceId)
    })

    it('Notes should be rendered', () => {
      expect(
        wrapper.findComponent({ ref: `notesHeader-${firstNote.id}` }).text(),
      ).toBe('Title 1')
      expect(
        wrapper.findComponent({ ref: `notesHeader-${secondNote.id}` }).text(),
      ).toBe('Title 2')
    })

    it('Note should be updated on blur', () => {
      const spy = jest.spyOn(services.notes, 'patchNote')

      wrapper
        .findComponent({ ref: `panelContent-${firstNote.id}` })
        .vm.$emit('blur')

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(attendanceId, firstNote.id, {
        content: 'Text',
      })
    })
  })
})
