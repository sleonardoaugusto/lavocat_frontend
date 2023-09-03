<template>
  <v-combobox
    v-model="select"
    :items="items"
    label="Serviços prestados"
    multiple
    chips
    item-text="text"
    item-value="value"
  />
</template>

<script>
export default {
  name: 'ServicesOptions',
  data: () => ({
    select: [],
    items: [
      { value: 'DPVAT', text: 'DPVAT' },
      { value: 'AUXILIO_DOENCA', text: 'Auxílio Doença' },
      { value: 'AUXILIO_ACIDENTE', text: 'Auxílio Acidente' },
      { value: 'LOAS', text: 'LOAS' },
      { value: 'APOSENTADORIA', text: 'Aposentadoria' },
      { value: 'ACAO_CONTRA_CONDUTOR', text: 'Ação Contra Condutor' },
      { value: 'ACAO_TRABALHISTA', text: 'Ação Trabalhista' },
      { value: 'ACAO_PREVIDENCIARIA', text: 'Ação Previdenciária' },
      { value: 'SEGURO_DE_VIDA_PROPRIO', text: 'Seguro de Vida Próprio' },
      { value: 'SEGURO_CONDUTOR', text: 'Seguro Condutor' },
      {
        value: 'SEGURO_DE_VIDA_EMPRESARIAL',
        text: 'Seguro de Vida Empresarial',
      },
    ],
  }),
  watch: {
    select() {
      const values = this.select.map(option => option.value)
      this.$emit('changed', values)
    },
  },
}
</script>

<style scoped></style>
