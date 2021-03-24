<template>
  <v-form>
    <BaseHeading text="Novo Atendimento" />
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
        <v-textarea label="Relatório" value="" rows="10" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-right">
        <v-btn
          @click="submit"
          :disabled="isLoading"
          id="submit"
          color="success"
          right
        >
          <v-progress-circular
            v-show="isLoading"
            size="18"
            indeterminate
            color="green"
          />
          <span v-show="!isLoading">Cadastrar</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import BaseHeading from '@/components/base/BaseHeading'
import { required } from 'vuelidate/lib/validators'
import validations from '@/mixins/formValidations'
import services from '@/services'
import { cpfValidator } from '@/utils/validators'

export default {
  name: 'AttendanceForm',
  components: {
    BaseHeading
  },
  mixins: [validations],
  data: () => ({
    form: {
      customer_name: null,
      document_id: null,
      files: []
    }
  }),
  validations: {
    form: {
      customer_name: { required },
      document_id: { required, cpfValidator }
    }
  },
  methods: {
    async submit() {
      this.touch()
      if (this.formIsReady) {
        const data = this.parseForm()
        this.toggleLoading()
        await services.attendance.create(data)
        this.toggleLoading()
      }
    },
    parseForm() {
      return {
        ...this.form,
        document_id: this.form.document_id
          .replace('.', '')
          .replace('.', '')
          .replace('-', '')
      }
    }
  }
}
</script>

<style scoped></style>
