import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import AttendanceNotesSection from '@/components/Attendance/AttendanceNotesSection'
import services from '@/services'
import flushPromises from 'flush-promises'

jest.mock('@/services')

describe('<AttendanceNotesSection />', () => {
  Vue.use(Vuetify)

  let wrapper
  let vuetify
  let propsData

  beforeEach(() => {
    propsData = { attendanceId: null }
    vuetify = new Vuetify()
    wrapper = factory()
  })

  const factory = opts =>
    mount(AttendanceNotesSection, { Vue, vuetify, ...opts })

  describe('Component mounted with attendanceId', () => {
    const attendanceId = 1
    const firstNote = { id: 1, header: 'Title 1', content: 'Text' }
    const secondNote = { id: 2, header: 'Title 2', content: 'Text 2' }

    beforeEach(async () => {
      services.notes.getNotes.mockResolvedValueOnce([firstNote, secondNote])
      wrapper = await factory({ propsData: { attendanceId } })
      await flushPromises()
      jest.clearAllMocks()
    })

    it('Service should be called with attendaceId', () => {
      const spy = jest.spyOn(services.notes, 'getNotes')

      wrapper = factory({ propsData: { attendanceId } })

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
      const spy = jest.spyOn(services.notes, 'updateNote')

      wrapper
        .findComponent({ ref: `panelContent-${firstNote.id}` })
        .vm.$emit('blur', 'New text')

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(attendanceId, firstNote.id, 'New text')
    })
  })
})
