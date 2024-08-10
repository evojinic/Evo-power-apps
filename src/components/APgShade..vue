<template>
  <transition name="fast-fade">
    <div id="a-pg-shade">
      <!-- critical error -->
      <div v-if="error && error.status === 500" class="a-pg-forbidden">
        <h1>Server Error</h1>
        <h4>{{ error.message }}</h4>
        <v-icon size="80">error</v-icon>
        <h3 class="primary">try refreshing using ctrl + F5</h3>
        <h3 class="primary">or logging out and in to clear it</h3>
        <h4>if issue persist contact Simonas Lukosius</h4>
        <v-btn
          color="primary"
          @click="logout"
        >
          Log Out
        </v-btn>
      </div>

      <div v-else-if="error && error.status === 401" class="a-pg-forbidden">
        <h1>Account Error</h1>
        <v-icon size="80">error</v-icon>
        <h1 class="primary">{{ criticalError }}</h1>
        <h3>logging out and in to clear it</h3>
        <h4>if issue persist contact Simonas Lukosius</h4>
        <v-btn
          color="primary"
          @click="logout"
        >
          Log Out
        </v-btn>
      </div>

      <div v-else-if="type === 'logout'" class="a-pg-logout">
        <!-- <v-icon size="80">check</v-icon> -->
        <h1 style="background-color: #002B49; margin-top: 50px; padding: 80px 0px;">
          <div style="color: #fff">{{ text }}</div>
          <br />
          <v-btn color="primary" @click="logout">Log Out</v-btn>
        </h1>
      </div>

      <!-- error -->
      <div v-else-if="error && (error.status === 406 || error.status === 404)" class="a-pg-forbidden">
        <h1>Error {{ error.status }}</h1>
        <v-icon size="80">error</v-icon>
        <h2 class="error">{{ error.message }}</h2>
      </div>

      <!-- loading -->
      <div v-else-if="type === 'pending'" class="a-pg-forbidden">
        <ga-spinner />
        <h3>{{ text }}</h3>
      </div>

      <!-- forbidden -->
      <div v-else-if="error && error.status === 403 && !quote_id" class="a-pg-forbidden">
        <v-icon size="80">block</v-icon>
        <h1>Access Denied</h1>
      </div>
      <div v-else-if="error && error.status === 403 && quote_id" class="a-pg-forbidden">
        <v-icon size="80">block</v-icon>
        <h1>{{ quote_id }}</h1>
        <h1>Isn't Your Quote</h1>
        <h3>or you do not have access</h3>
      </div>
      <div v-else class="a-pg-forbidden">
        <v-icon size="80">error</v-icon>
        <h1>UNKNOWN</h1>
        <h1>ERROR</h1>
        <h3 class="primary">try refreshing using ctrl + F5</h3>
        <h3 class="primary">or logging out and in to clear it</h3>
        <h4>if issue persist contact Simonas Lukosius</h4>
        <v-btn
          color="primary"
          @click="logout"
        >
          Log Out
        </v-btn>
      </div>

      <!-- actions -->
      <div v-if="type !== 'pending' && type !== 'logout' && !criticalError">
        <v-btn
          color="primary"
          :to="{ name: 'quotes' }"
        >
          <v-icon dark>arrow_back</v-icon>Back to Your Quotes
        </v-btn>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {

  name: 'APgShade',

  props: {
    type: {
      type: String,
      default: 'forbidden',
    },
    action: {
      type: String,
      default: 'quotes',
    },
    quote_id: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    error: {
      type: Object,
    },
  },
  computed: {
    ...mapState('account', ['criticalError']),
  },
  methods: {
    ...mapActions('account', ['logout']),
  },

};
</script>

<style>
#a-pg-shade {
  background-color: rgba(0,0,0,0.5);
  position: fixed;
  /* color: orange; */
  text-align: center;
  padding-top: 10%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
.a-pg-forbidden {
  color: rgba(0,0,0,.70);
}
</style>
