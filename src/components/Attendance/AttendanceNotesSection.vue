<template>
  <v-expansion-panels ref="expansionPanels">
    <v-expansion-panel v-for="(note, i) in notes" :key="i">
      <v-expansion-panel-header :ref="`notesHeader-${note.id}`">
        {{ note.header }}
      </v-expansion-panel-header>
      <v-expansion-panel-content eager>
        <v-textarea
          :ref="`panelContent-${note.id}`"
          flat
          solo
          auto-grow
          name="input-7-4"
          label="Digite aqui"
          v-model="note.content"
          @blur="onBlur(note.id, note.content)"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import services from '@/services'

export default {
  name: 'AttendanceNotesSection',
  data: () => ({
    notes: [],
    attendanceId: null,
  }),
  async created() {
    this.attendanceId = this.$route?.params?.attendanceId
    if (this.attendanceId) {
      this.notes = await services.notes.getNotes(this.attendanceId)
    }
  },
  methods: {
    onBlur(noteId, text) {
      if (this.attendanceId) {
        const data = { content: text }
        services.notes.patchNote(this.attendanceId, noteId, data)
      }
    },
  },
}
</script>

<style scoped></style>
