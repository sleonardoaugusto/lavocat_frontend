<template>
  <v-form>
    <v-container>
      <BaseHeading text="Atendimento"/>
      <BaseHeading text="Dados do Cliente" tag="h6"/>
      <v-row>
        <v-col>
          <v-text-field
            id="name"
            ref="name"
            label="Nome"
            v-model="$v.form.name.$model"
            :error-messages="errorMessage('name')"
          />
        </v-col>
        <v-col>
          <v-text-field
            id="document-id"
            ref="document-id"
            label="CPF"
            v-model.number="$v.form.document_id.$model"
            :error-messages="errorMessage('document_id')"
          />
        </v-col>
      </v-row>
      <BaseHeading text="Documentos do Cliente" tag="h6"/>
      <v-row>
        <v-col>
          <template v-for="(d, i) in form.attachments">
            <v-row :key="d.key">
              <v-file-input
                :id="`attachment-${i}`"
                :ref="`attachment-${i}`"
                label="Anexo"
                v-model="d.doc"
              />
              <v-btn
                @click="delField(d.key)"
                id="remove-document"
                class="mx-2"
                fab
                color="error"
                small
              >
                <v-icon small>
                  mdi-minus
                </v-icon>
              </v-btn>
            </v-row>
          </template>
          <v-row>
            <v-col>
              <v-btn
                @click="addField"
                id="add-document"
                class="mx-2"
                fab
                color="primary"
                small
              >
                <v-icon small>
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-md-2 offset-10 text-right">
          <v-btn @click="submit" id="submit" color="success" right>
            Cadastrar
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>

</template>

<script>
import BaseHeading from '@/components/base/BaseHeading'
import services from '@/services/.'
import { required } from 'vuelidate/lib/validators'
import validations from '@/mixins/validations'

export default {
  name: 'AttendanceForm',
  mixins: [validations],
  components: { BaseHeading },
  data: () => ({
    form: {
      name: null,
      document_id: null,
      attachments: [{ doc: null, key: Math.random() }]
    }
  }),
  validations: {
    form: {
      name: { required },
      document_id: { required }
    }
  },
  methods: {
    addField() {
      this.form.attachments.push({ doc: null, key: Math.random() })
    },
    delField(key) {
      this.form.attachments = this.form.attachments.filter(doc => doc.key !== key)
    },
    async submit() {
      function parseAttachments(attachments) {
        return attachments.map(att => att.doc)
      }

      this.touch()
      if (this.formIsReady) {
        const attachments = parseAttachments(this.form.attachments)
        const data = { ...this.form, attachments }
        await services.auth.create(data)
      }
    }
  }
}
</script>

<style scoped>

</style>
