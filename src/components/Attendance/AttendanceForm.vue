<template>
  <v-form>
    <v-row>
      <v-col cols="12" md="6" sm="12">
        <v-text-field
          id="customer-name"
          ref="customerName"
          label="Nome do Cliente"
          v-model="$v.form.customer_name.$model"
          :error-messages="errorMessage('customer_name')"
        />
      </v-col>
      <v-col cols="12" md="6" sm="12">
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
      <v-col col="12" md="6" sm="12">
        <v-select
          id="status"
          ref="statusesSelect"
          label="Status"
          v-model.number="$v.form.status.$model"
          :items="statusesOptions"
          :error-messages="errorMessage('status')"
        />
      </v-col>
      <v-col cols="12" md="6" sm="12">
        <v-file-input
          id="files"
          ref="files"
          label="Anexos"
          v-model="form.files"
          multiple
          chips
        />
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
      <v-col class="text-right">
        <v-btn
          ref="submitBtn"
          id="submit"
          @click="submit"
          :loading="isLoading"
          :color="colorStyle"
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
import services from '@/services'
import { cpfValidator } from '@/utils/validators'
import { clearDocumentId, objToSelect } from '@/utils/formatters'

export default {
  name: 'AttendanceForm',
  mixins: [validations],
  props: {
    value: {
      type: [Object],
      default: () => {}
    },
    update: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    form: {
      customer_name: null,
      document_id: null,
      status: null,
      files: [],
      resume: null
    },
    statusesOptions: []
  }),
  validations: {
    form: {
      customer_name: { required },
      document_id: { required, cpfValidator },
      status: { required }
    }
  },
  async created() {
    const statuses = await services.attendance.getStatuses()
    this.statusesOptions = objToSelect(statuses)
  },
  methods: {
    async submit() {
      this.touch()
      if (this.formIsReady) {
        const data = this.parseForm()
        this.toggleLoading()
        await this.$emit('submit', data)
        this.toggleLoading()
      }
    },
    parseForm() {
      return {
        ...this.form,
        document_id: clearDocumentId(this.form.document_id)
      }
    }
  },
  computed: {
    submitBtnLabel() {
      return this.update ? 'Salvar' : 'Cadastrar'
    },
    colorStyle() {
      return this.update ? 'primary' : 'green'
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        this.form = { ...this.form, ...val }
      }
    }
  }
}
</script>

<style scoped></style>
