<template>
  <v-form>
    <BaseHeading text="Atendimento"/>
    <v-row>
      <v-col cols="12" md="6" sm="12">
        <v-text-field
          id="customer-name"
          ref="customerName"
          label="Nome"
          v-model="$v.form.customer_name.$model"
          :error-messages="errorMessage('customer_name')"
        />
      </v-col>
      <v-col cols="12" md="6" sm="12">
        <v-text-field
          id="document-id"
          ref="document-id"
          label="CPF"
          v-model.number="$v.form.document_id.$model"
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
        <v-textarea
          label="Relatório"
          value=""
          rows="10"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-right">
        <v-btn @click="submit" id="submit" color="success" right>
          Cadastrar
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import BaseHeading from '@/components/base/BaseHeading'
import { required } from 'vuelidate/lib/validators'
import validations from '@/mixins/validations'
import services from '@/services'

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
      document_id: { required }
    }
  },
  methods: {
    async submit() {
      this.touch()
      if (this.formIsReady) {
        await services.auth.create(this.form)
      }
    }
  }
}
</script>

<style scoped>

</style>
