<template>
  <div class="mt-auto">
    <v-row>
      <v-col cols="4" offset="4" class="text-center align-center">
        <AppHeading text="Entrar no L'avocat" tag="h6" />
      </v-col>
    </v-row>
    <v-form>
      <v-row>
        <v-col cols="4" offset="4">
          <v-text-field
            id="username"
            ref="username"
            label="Usuário"
            v-model="$v.form.username.$model"
            :error-messages="errorMessage('username')"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" offset="4">
          <v-text-field
            id="password"
            ref="password"
            label="Senha"
            type="password"
            v-model="$v.form.password.$model"
            @keydown.enter="onSubmit"
            :error-messages="errorMessage('password')"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" offset="4" class="text-right">
          <v-btn
            id="submit"
            ref="submitBtn"
            color="primary"
            @click="onSubmit"
            :loading="isLoading"
          >
            entrar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import validations from '@/mixins/formValidations'
import { required } from 'vuelidate/lib/validators'
import services from '@/services'
import { Auth } from '@/utils/auth'
import AppHeading from '@/components/ui/AppHeading'

export default {
  name: 'Login',
  components: { AppHeading },
  mixins: [validations],
  data: () => ({
    form: {
      username: null,
      password: null
    }
  }),
  validations: {
    form: {
      username: { required },
      password: { required }
    }
  },
  methods: {
    async onSubmit() {
      this.touch()
      if (this.formIsReady) {
        this.toggleLoading()
        const { access } = await services.auth.login(this.form)
        Auth.login(access)
        this.toggleLoading()
      }
    }
  }
}
</script>

<style scoped></style>
