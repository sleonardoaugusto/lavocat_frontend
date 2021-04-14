<template>
  <div class="mt-auto">
    <v-row>
      <v-col cols="4" offset="4" class="text-center align-center">
        <BaseHeading text="Entrar no L'avocat" tag="h6" />
      </v-col>
    </v-row>
    <v-form>
      <v-row>
        <v-col cols="4" offset="4">
          <v-text-field
            id="username"
            ref="username"
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
            type="password"
            v-model="$v.form.password.$model"
            @keydown.enter="submit"
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
            @click="submit"
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
import BaseHeading from '@/components/base/BaseHeading'
import validations from '@/mixins/formValidations'
import { required } from 'vuelidate/lib/validators'
import services from '@/services'
import router from '@/router'
import { Auth } from '@/utils/auth'

export default {
  name: 'Login',
  components: { BaseHeading },
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
    async submit() {
      this.touch()
      if (this.formIsReady) {
        this.toggleLoading()
        const { access } = await services.auth.login(this.form)
        this.toggleLoading()
        if (access) Auth.setToken('token', access)
        if (Auth.isLoggedIn()) await router.push('/')
      }
    }
  }
}
</script>

<style scoped></style>
