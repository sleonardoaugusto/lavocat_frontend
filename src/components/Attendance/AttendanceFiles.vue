<template>
  <div>
    <v-file-input
      ref="attachments"
      id="files"
      multiple
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
            <td>{{ file.name || file.filename | truncate }}</td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-show="isNotFile(file)"
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
              <AttendanceDeleteIconFile
                @delete="onFileDelete(idx)"
                :file="file"
              />
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import AttendanceDeleteIconFile from '@/components/Attendance/AttendanceDeleteIconFile'

export default {
  name: 'AttendanceFiles',
  components: { AttendanceDeleteIconFile },
  filters: {
    truncate: val => val?.slice(0, 50)
  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    internalFiles: [],
    files: []
  }),
  methods: {
    onFileDelete(idx) {
      this.internalFiles.splice(idx, 1)
    },
    setInternal(files) {
      this.files = []
      files.forEach(f => this.internalFiles.push(f))
      this.$emit('changed', this.internalFiles)
    },
    isNotFile(attachment) {
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
