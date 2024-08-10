<template>
  <div>
    <v-toolbar app style="height:64px">
      <v-btn flat @click.stop="drawer = !drawer">
        <v-icon left>menu</v-icon>
        Menu
      </v-btn>

      <!-- <v-toolbar-title>Title</v-toolbar-title> -->
      <v-spacer />
      <div id="logo">
        <img src="/img/IsoTek.svg" height="42" alt="Lamons IsoTek">
      </div>
    </v-toolbar>

    <v-navigation-drawer
      id="navDrawer"
      v-model="drawer"
      fixed
      top
      temporary
      dark
    >
      <v-list v-if="user">
        <div class="menu-title">
          <h3>{{ user.displayName }}</h3>
        </div>

        <v-list-tile :to="{ name: 'user' }">
          <v-list-tile-action><v-icon>person</v-icon></v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>My Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="{ name: 'quotes' }">
          <v-list-tile-action><v-icon>library_books</v-icon></v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home / My Quotes</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="{ name: 'estimator' }">
          <v-list-tile-action><v-icon>library_add</v-icon></v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>New Quote</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <div v-if="isDnv || roleOrders">
          <div class="menu-title">
            <h3>Production</h3>
          </div>

          <v-list-tile v-if="roleOrders" :to="{ path: '/o' }">
            <v-list-tile-action><v-icon>shopping_cart</v-icon></v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Orders</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <a v-bind:href="'/pb/index.html#/home'" target="_blank" style="text-decoration: none; color: white">
            <v-list-tile>
              <v-list-tile-action><v-icon>table_chart</v-icon></v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Production Board</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </a>

          <v-list-tile v-if="isDnv" :to="{ path: '/warroom' }">
            <v-list-tile-action><v-icon>timeline</v-icon></v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>War Room</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile v-if="isDnv" :to="{ path: '/nc' }">
            <v-list-tile-action><v-icon>priority_high</v-icon></v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Non Conformance</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile v-if="isDnv" :to="{ path: '/s' }">
            <v-list-tile-action><v-icon>people</v-icon></v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Sign Offs</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile v-if="isDnv" :to="{ path: '/tp' }">
            <v-list-tile-action><v-icon>fitness_center</v-icon></v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Tubes to Pull</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

        </div>

        <div v-if="roleUsers || rolePS">
          <div class="menu-title">
            <h3>ADMIN</h3>
          </div>

          <v-list-tile v-if="roleUsers" :to="{ name: 'dist' }">
            <v-list-tile-action><v-icon>list</v-icon></v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Users / Distributor & Branch</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <!-- <v-list-tile :to="{ name: 'users' }">
            <v-list-tile-action><v-icon>list</v-icon></v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>List All Users</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile> -->

          <!-- <v-list-tile :to="{ name: 'createUser' }">
            <v-list-tile-action><v-icon>person_add</v-icon></v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Add a New User</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile> -->

          <v-list-tile v-if="rolePS" :to="{ name: 'priceSheets' }">
            <v-list-tile-action><v-icon>attach_money</v-icon></v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Price Sheets</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </div>

        <div v-if="isDev">
          <div class="menu-title">
            <h3>DEV</h3>
          </div>

          <v-list-tile :to="{ name: 'inventory' }">
            <v-list-tile-action><v-icon>store</v-icon></v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Inventory</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile :to="{ name: 'import' }">
            <v-list-tile-action><v-icon>import_export</v-icon></v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Import / Export</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </div>

        <v-list-tile :to="{ name: 'bugreport' }">
          <v-list-tile-action><v-icon>comment</v-icon></v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Got Feedback?</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <div class="menu-item" style="padding: 0.25em 2em">
          <v-btn solid color="primary" block @click="logout">Log Out</v-btn>
        </div>
      </v-list>

      <v-list v-else class="pa-1">
        <div class="menu-item">
          <v-btn flat block :to="{ name: 'login' }">LOG IN</v-btn>
        </div>
      </v-list>

      <div class="copyRights">&nbsp;&nbsp;&copy; 2018 Lamons/Isotek</div>
    </v-navigation-drawer>
  </div>
</template>

<script>

export default {
  name: 'ToolBar',
  data() {
    return { drawer: false, clipped: false };
  },
  computed: {
    user() { return this.$store.getters['account/user']; },
    roleUsers() { return this.$store.getters['account/roleUsers']; },
    isDev() { return this.$store.getters['account/isDev']; },
    isDnv() { return this.$store.getters['account/isDnv']; },
    rolePS() { return this.$store.getters['account/rolePS']; },
    roleOrders() { return this.$store.getters['account/roleOrders']; },
  },
  methods: {
    logout() { this.$store.dispatch('account/logout'); },
  },
};
</script>

<style>
#logo { height: 45px; }

#displayNameBlock {
  width: 100px;
  text-align: center;
  margin: 0 0 0 60%;
  padding-top: 20px;
}

.menu-title {
  width: 100%;
  padding: 6px;
  border-bottom: thin solid white;
  text-align: center;
}

.copyRights {
  text-align: center;
  color: white;
  padding: 12px;
}
</style>
