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
          @blur="onBlur(note.id, $event)"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import services from '@/services'

export default {
  name: 'AttendanceNotesSection',
  props: {
    attendanceId: {
      type: Number,
      required: false,
    },
  },
  data: () => ({
    notes: [{ id: 1, header: 'Title 1', content: 'Text' }],
  }),
  async created() {
    if (this.attendanceId) {
      this.notes = await services.notes.getNotes(this.attendanceId)
    }
  },
  methods: {
    onBlur(noteId, data) {
      services.notes.updateNote(this.attendanceId, noteId, data)
    },
  },
}
</script>

<style scoped></style>
