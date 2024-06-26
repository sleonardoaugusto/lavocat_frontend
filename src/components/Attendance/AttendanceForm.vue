<template>
  <v-form>
    <v-overlay ref="overlay" :value="busy">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <v-row>
      <v-col cols="12" md="12">
        <v-checkbox
          id="is-client"
          ref="isClient"
          label="Captado"
          v-model="form.is_client"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          id="customer-name"
          ref="customerName"
          label="Nome do Cliente"
          v-model="$v.form.customer_name.$model"
          :error-messages="errorMessage('customer_name')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          id="document-id"
          ref="documentId"
          label="CPF"
          type="tel"
          v-mask="'###.###.###-##'"
          v-model="$v.form.document_id.$model"
          :error-messages="errorMessage('document_id')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <ServicesOptions
          ref="servicesOptions"
          @changed="options => (form.services_types = options)"
          :selected="form.services_types"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          id="source"
          ref="source"
          label="Origem"
          v-model="$v.form.source.$model"
          :error-messages="errorMessage('source')"
        />
      </v-col>
      <v-col cols="12" md="6">
        <AttendanceFiles
          ref="attachments"
          @changed="files => (form.files = files)"
          :attendance-files="form.files"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AttendanceNotesSection :key="Math.random()" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          id="resume"
          ref="resume"
          label="Relatório"
          v-model="form.resume"
          rows="10"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          id="status-resume"
          ref="statusResume"
          label="Resumo de Status"
          v-model="form.status_resume"
          rows="10"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-space-between">
        <v-btn ref="previousBtn" id="previousBtn" href="/atendimentos">
          Voltar
        </v-btn>
        <v-btn
          ref="submitBtn"
          id="submit"
          @click="onSubmit"
          :loading="busy"
          :color="colorStyle"
          class="white--text"
          depressed
          right
        >
          {{ submitBtnLabel }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import validations from '@/mixins/formValidations'
import { cpfValidator } from '@/utils/validators'
import { clearDocumentId } from '@/utils/formatters'
import AttendanceFiles from '@/components/Attendance/AttendanceFiles'
import ServicesOptions from '@/components/Attendance/ServicesOptions'
import AttendanceNotesSection from '@/components/Attendance/AttendanceNotesSection'

export default {
  name: 'AttendanceForm',
  components: { AttendanceNotesSection, ServicesOptions, AttendanceFiles },
  mixins: [validations],
  props: {
    attendance: {
      type: Object,
      default: () => {},
    },
    update: {
      type: Boolean,
      default: false,
    },
    busy: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    form: {
      customer_name: null,
      document_id: null,
      source: null,
      files: [],
      resume: null,
      status_resume: null,
      services_types: [],
      is_client: true,
    },
  }),
  validations: {
    form: {
      customer_name: { required },
      document_id: { cpfValidator },
      source: { required },
    },
  },
  async created() {
    if (!this.update) {
      const cache = JSON.parse(localStorage.getItem('atttendance-form-cache'))
      if (cache && Object.keys(cache)) this.form = { ...cache }
    }
  },
  methods: {
    onSubmit() {
      this.touch()
      if (this.formIsReady) {
        const data = this.parseForm()
        this.$emit('submit', data)
      }
    },
    parseForm() {
      return {
        ...this.form,
        document_id: clearDocumentId(this.form.document_id),
      }
    },
  },
  computed: {
    submitBtnLabel() {
      return this.update ? 'Salvar' : 'Cadastrar'
    },
    colorStyle() {
      return this.update ? 'primary' : 'green'
    },
  },
  watch: {
    attendance: {
      deep: true,
      handler(val) {
        if (this.update) this.form = { ...this.form, ...val }
      },
    },
    form: {
      deep: true,
      handler(val) {
        if (!this.update) {
          const cache = { ...val }
          delete cache['files']
          localStorage.setItem('atttendance-form-cache', JSON.stringify(cache))
        }
      },
    },
  },
}
</script>

<style scoped></style>
