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
            <td class="d-inline-flex align-center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-show="!isFile(file)"
                    :id="`view-${idx}`"
                    :href="file.file"
                    target="_blank"
                    icon
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-eye-outline</v-icon>
                  </v-btn>
                </template>
                <span>Ver</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-show="!isFile(file)"
                    :id="`download-${idx}`"
                    @click="downloadFile(file)"
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
              <template v-if="!isFile(file)">
                <AttendanceFileRename :file="file" @update="reloadFiles" />
              </template>
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
import AttendanceDeleteIconFile from '@/components/Attendance/AttendanceDeleteFile'
import axios from 'axios'
import { saveAs } from 'file-saver'
import AttendanceFileRename from '@/components/Attendance/AttendanceFileRename'
import services from '@/services'

export default {
  name: 'AttendanceFiles',
  components: { AttendanceFileRename, AttendanceDeleteIconFile },
  filters: {
    truncate: val => val?.slice(0, 50),
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    internalFiles: [],
    files: [],
  }),
  methods: {
    reloadFiles() {
      services.attendanceFile
        .getFilesByAttendanceId(this.$route.params.attendanceId)
        .then(resp => {
          this.internalFiles = []
          this.setInternal(resp)
        })
    },
    onFileDelete(idx) {
      this.internalFiles.splice(idx, 1)
    },
    setInternal(files) {
      this.files = []
      files.forEach(f => this.internalFiles.push(f))
      this.$emit('changed', this.internalFiles)
    },
    async downloadFile(file) {
      const { data } = await axios.get(file.file, {
        responseType: 'blob',
      })
      const newFile = new File([data], file.filename, {
        type: 'application/octet-stream',
      })
      saveAs(newFile)
    },
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
      },
    },
  },
}
</script>

<style scoped></style>
