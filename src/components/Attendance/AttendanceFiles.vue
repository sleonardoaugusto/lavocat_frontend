<template>
  <div>
    <v-file-input
      ref="attachments"
      id="files"
      chips
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
            <td>{{ file.name }}</td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :id="`remove-${idx}`"
                    @click="remove(idx)"
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
      this.files = []
      files.forEach(f => this.internalFiles.push(f))
      this.$emit('changed', files)
    },
    remove(idx) {
      this.internalFiles.splice(idx, 1)
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && val.length) {
          this.setInternal(val)
        }
      }
    }
  }
}
</script>

<style scoped></style>
