<template>
  <v-form>
    <BaseHeading text="Atendimento"/>
    <v-row>
      <v-col cols="12" md="6" sm="12">
        <v-text-field
          id="name"
          ref="name"
          label="Nome"
          v-model="$v.form.name.$model"
          :error-messages="errorMessage('name')"
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
    </v-row>
    <BaseHeading text="Documentos do Cliente" tag="h5"/>
    <v-row>
      <v-col>
        <template v-for="(d, i) in form.attachments">
          <v-row :key="d.id" align="center">
            <v-col v-if="!d.added">
              <v-chip>
                {{ d.doc.name }}
              </v-chip>
            </v-col>
            <v-col v-else>
              <v-file-input
                :id="`attachment-${i}`"
                :ref="`attachment-${i}`"
                label="Anexo"
                v-model="d.doc"
                multiple
                chips
              />
            </v-col>
            <v-col>
              <v-btn
                id="remove-document"
                fab
                x-small
                color="error"
                @click="delField(d.id)"
              >
                <v-icon small>
                  mdi-minus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <v-row>
          <v-col>
            <v-btn
              id="add-document"
              fab
              x-small
              color="primary"
              @click="addField"
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
      name: null,
      document_id: null,
      attachments: [{ doc: null, id: Math.random() }]
    }
  }),
  validations: {
    form: {
      name: { required },
      document_id: { required }
    }
  },
  created() {
    this.form = { ...this.getData() }
  },
  methods: {
    getData() {
      return {
        name: 'Maria Aparecida',
        document_id: 45009877899,
        attachments: [
          { id: 1, doc: new File(['comp_end'], 'comp_end.txt') },
          { id: 2, doc: new File(['cnh'], 'cnh.txt') },
          { id: 3, doc: new File(['contrato'], 'contrato.txt') }
        ]
      }
    },
    addField() {
      this.form.attachments.push({ doc: null, id: Math.random(), added: true })
    },
    delField(key) {
      this.form.attachments = this.form.attachments.filter(doc => doc.id !== key)
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
