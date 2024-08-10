<template>
  <v-slide-y-transition mode="out-in">
    <div class="div-center">
      <v-form
        v-if="status === null || status.loggedOut"
        @submit.prevent="login({ username, password })"
      >
        <v-text-field
          v-model="username"
          :rules="notEmptyRules"
          label="Username"
          required
        />
        <v-text-field
          v-model="password"
          :rules="notEmptyRules"
          label="Password"
          type="password"
          required
        />
        <v-btn type="submit" :disabled="!valid">
          Login
        </v-btn>
      </v-form>
      <ga-spinner v-if="status.loginPending" />
      <div v-if="status.loginPending">
        <h3>working...</h3>
      </div>
      <v-btn
        v-if="status.loggedIn"
        type="submit"
        @click="logout"
      >
        Log out
      </v-btn>
    </div>
  </v-slide-y-transition>
</template>

<script>
export default {
  name: 'GaLogin',
  data: () => ({
    username: '',
    password: '',
    notEmptyRules: [value => value !== '' || 'Cannot be empty.'],
  }),
  created() {
    document.title = 'GA - login';
    if (this.status.loggedIn) this.$router.push('/estimator');
  },
  computed: {
    status() { return this.$store.getters['account/status'] || {}; },
    valid() { return this.username && this.password; },
  },
  methods: {
    login(payload) { return this.$store.dispatch('account/login', payload); },
    logout() { return this.$store.dispatch('account/logout'); },
  },
};
</script>

<style scoped>
  .div-center { width: 220px; margin-left: -120px; position: relative; left: 50%; top: 30%; text-align: center; }
</style>
