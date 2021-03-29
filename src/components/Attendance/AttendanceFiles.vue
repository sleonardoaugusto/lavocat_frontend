<template>
  <div>
    <v-file-input
      ref="attachments"
      id="files"
      multiple
      hide-input
      label="Anexar arquivos"
      v-model="files"
      @change="setInternal"
    />
    <v-simple-table
      v-show="!!internalFiles.length"
      ref="attachmentsTable"
      height="300px"
      fixed-header
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Arquivo</th>
            <th class="text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(file, idx) in internalFiles" :key="idx">
            <td>{{ file.name || file.filename }}</td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-show="instanceOfFile(file)"
                    :id="`download-${idx}`"
                    :href="file.file"
                    target="_blank"
                    icon
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-cloud-download-outline</v-icon>
                  </v-btn>
                </template>
                <span>Baixar</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :id="`remove-${idx}`"
                    @click="remove(file, idx)"
                    icon
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>Remover</span>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import services from '@/services'

export default {
  name: 'AttendanceFiles',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({ internalFiles: [], files: [] }),
  methods: {
    setInternal(files) {
      files.forEach(f => this.internalFiles.push(f))
      this.$emit('changed', this.internalFiles)
    },
    async remove(file, idx) {
      if (!(file instanceof File)) {
        const { id } = file
        await services.attendance.deleteAttendanceFile(id)
      }
      this.internalFiles.splice(idx, 1)
    },
    instanceOfFile(attachment) {
      return !(attachment instanceof File)
    }
  },
  watch: {
    value: {
      deep: true,
      handler(files) {
        if (
          files &&
          files.length &&
          files[files.length - 1] !==
            this.internalFiles[this.internalFiles.length - 1]
        ) {
          this.internalFiles = []
          this.setInternal(files)
        }
      }
    }
  }
}
</script>

<style scoped></style>
