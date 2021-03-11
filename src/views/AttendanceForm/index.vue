<template>
  <v-form>
    <v-container>
      <BaseHeading text="Atendimento"/>
      <BaseHeading text="Dados do Cliente" tag="h6"/>
      <v-row>
        <v-col>
          <v-text-field
            id="name"
            label="Nome"
          />
        </v-col>
        <v-col>
          <v-text-field
            id="cpf"
            label="CPF"
          />
        </v-col>
      </v-row>
      <BaseHeading text="Documentos do Cliente" tag="h6"/>
      <v-row>
        <v-col>
          <template v-for="d in documents">
            <v-row :key="d.key">
              <v-file-input
                chips
                multiple
                label="Anexo"
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
                color="success"
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
    </v-container>
  </v-form>

</template>

<script>
import BaseHeading from '@/components/base/BaseHeading'

export default {
  name: 'index',
  components: { BaseHeading },
  data: () => ({
    documents: [{ doc: null, key: Math.random() }]
  }),
  methods: {
    addField() {
      this.documents.push({ doc: null, key: Math.random() })
    },
    delField(key) {
      this.documents = this.documents.filter(doc => doc.key !== key)
    },
    random() {
      return Math.random()
    }
  }
}
</script>

<style scoped>

</style>
