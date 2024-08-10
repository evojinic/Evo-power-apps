
<template>
  <v-app id="app">
    <toolbar />

    <div class="app-content">
      <router-view />
    </div>

    <transition name="slide-fade">
      <div
        v-if="alert.message"
        class="alert"
      >
        <v-alert
          :value="alert.message"
          :type="alert.type"
        >
          <h3 v-if="alert.title">
            {{ alert.title }}
          </h3>
          <p v-if="alert.message">
          {{ alert.message }}
          </p>
        </v-alert>
      </div>
    </transition>
    <!-- <div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div> -->
  </v-app>
</template>

<script>
import toolbar from '@/components/toolbar.vue';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'App',

  components: {
    toolbar,
  },

  data() {
    return {
      fixed: false,
    };
  },

  computed: {
    ...mapState({
      alert: state => state.alert,
    }),
  },

  watch: {
    // $route(to, from) {
    $route() {
      // clear alert on location change
      this.clearAlert();
    },
  },
  methods: {
    ...mapActions('auth', { authLogout: 'logout' }),
    ...mapActions({
      clearAlert: 'alert/clear',
    }),
    logout() {
      this.authLogout().then(() => this.$router.push('/'));
    },
  },
};
</script>

<style>
html { overflow-y: auto; }

.hide { display: none }

#pg {
  position: fixed;
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: space-evenly;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 450px;
}

#pg-content {
  grid-row: 1;
  grid-column: 1;
  overflow-y: auto;
  padding: 12px;
  margin-bottom: 145px;
}

.pg-form {
  background-image: linear-gradient(90deg, #D6D2C4, #fefefe, #fefefe, #fefefe, #fefefe, #fefefe );
  /* background: rgba(214, 210, 196, 1); */
  box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.5);
  padding-right: 45px;
  padding-bottom: 150px;
  margin-bottom: 65px;
  overflow-y: auto;
  grid-row: 1;
  grid-column: 2;
  z-index: 9;
}

.f-card {
  /* margin: auto; */
  /* padding: 5px 10px 5px 30px; */
  /* height: 360px; */
  padding-left: 30px;
  min-width: 240px;
  max-width: 340px;
  /* border-left: solid 3px #862633; */
  /* margin-left: 10px; */
}

.f-card-title {
  margin-top: 1em;
  padding: 0.5em 0;
  color: #862633;
  /* font-size: 12px !important; */
  margin-left: -20px;
  /* text-align: center; */
  font-weight: bold;
  /* color: #aaa; */
  /* min-height: 25px; */
  /* margin-bottom: 5px; */
}

#pg-content-shade {
  background-color: rgba(0,0,0,0.3);
  grid-row: 1;
  grid-column: 2;
  z-index: 8;
}

#pg-shade {
  background-color: rgba(0,0,0,0.5);
  position: fixed;
  /* color: #862633; */
  color: #862633;
  text-align: center;
  padding-top: 30%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

#pg-bottom-nav {
  background: #f5f5f5;
  box-shadow: 0 0 16px grey;
  position: fixed;
  left: 0;
  bottom: 0px;
  width: 100%;
  height: 80px;
  padding: 0 54px 0 10px;
  display: flex;
  /* flex-wrap: wrap; */
  align-items: center;
}

.pg-bottom-nav-btn {
  text-align: center;
}

@media only screen and (max-width: 1280px){
  #pg-content {
    overflow-y: auto;
    grid-row: 1;
    grid-column: span 2 / -1;
  }
  #pg-content-shade {
    grid-column: span 2 / -1;
  }
}

@media only screen and (max-width: 800px){
  #pg {
    grid-template-columns: 1fr;
  }
  #pg-content {
    grid-row: 1;
    grid-column: 1;
    margin-bottom: 64px;
  }
  .pg-form {
    grid-row: 1;
    grid-column: 1;
  }
  #pg-content-shade {
    grid-column: 1;
  }
  #print-book {
    padding: 0px;
  }
}

/* scroll bar */
/* width */
::-webkit-scrollbar {
  width: 18px;
  height: 18px;
}
/* Track */
::-webkit-scrollbar-track {
  /* background: rgba(0,0,0,.87); */
  box-shadow: inset 0 0 3px #333;
  background: #fafafa;
  /* background: #ffe0b2; */
    border-radius: 9px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #D6D2C4;
  /* background: rgba(134, 38, 51,0.4); */
  box-shadow: inset 0 0 3px #333;
  border-radius: 9px;
  /* box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5); */
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgba(134, 38, 51);
}

#displayNameBlock {
  width: 100px;
  text-align: center;
  margin: 0 0 0 60%;
  padding-top: 20px;
}

.vq-status-popup{
  padding-top: 60px;
}

.no-select {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}

/* overwrite veutify styles */
.theme--dark.v-navigation-drawer {
  background-color: #002B49;
}
.v-list .primary--text {
  background-color: #D6D2C4;
}
.app-content { padding: 64px 0 0 0; }
.theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
  background: rgba(134, 38, 51, 0.2);
  /* background: #ffb74d; */
  /* box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.5); */
  /* color: rgba(134, 38, 51,0.8) */
}

.theme--light.v-table tbody tr[active] {
  box-shadow: inset 0px 0px 7px rgba(0, 0, 0, 0.5);
  /* background: #ffe0b2 !important; */
  background: #ffe0b2;
}

.theme--light.v-label {
  color: #006298;
  font-size: 1.2em;
  /* font-weight: bold; */
}

.text-notice .v-label {
  color: #D61E38;
  /* font-size: 1em; */
}

table.v-table thead tr {height: 42px;}
table.v-table thead th {padding: 0 12px;}
table.v-table tbody td {height: 34px;}
.v-datatable__actions__select .v-select {margin: 0px 0 0px 24px;}
.gaInput input[type=number] {
  padding-left: 15px;
  color: #002B49 !important; font-weight: bold;
}
.gaInput input[type=number]:disabled {
  color: rgba(0,0,0,0.38) !important;
}
.gaInput input[type=string] {
  padding-left: 15px;
  color: #002B49 !important; font-weight: bold;
}
.gaInput input[type=string]:disabled {
  color: rgba(0,0,0,0.38) !important;
}
.gaInput input[type=text] {
  padding-left: 15px;
  color: #002B49 !important; font-weight: bold;
}
.gaInput input[type=text]:disabled {
  color: rgba(0,0,0,0.38) !important;
}
.gaInput .v-select__selections {
  padding-left: 15px;
  color: #002B49 !important; font-weight: bold;
}
.gaInput .v-select__selections:hover {
  color: #862633 !important; font-weight: bold;
}
.gaInput .v-icon:hover {
  color: #862633 !important; font-weight: bold;
}
.gaInput .v-icon:focus {
  color: #862633 !important; font-weight: bold;
}
.gaInput .v-label {
  color: rgba(0,0,0,0.6) !important;
  font-size: 1em !important;
}
.v-label:required {
  /* content: "*"; */
  /* display: inline-block; */
  color: red;
}

.alert { position: fixed; z-index: 99; bottom: 50px; left: 50%; width: 400px; margin-left: -200px}

.v-text-field.v-text-field--enclosed .v-input__slot {
  padding: 0 4px 0 4px !important;
}
.v-text-field {
  padding-top: 10px;
  margin-top: 4px;
}

/* transitions / animations */
.slide-fade-enter-active {
  transition: opacity .3s ease;
}
.slide-fade-leave-active {
  transition: opacity 1.2s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  /* transform: translateY(60px); */
}

/* transitions / animations */
.fast-fade-enter-active {
  transition: opacity .3s ease;
}
.fast-fade-leave-active {
  transition: opacity .3s ease;
}
.fast-fade-enter, .fast-fade-leave-to
/* .fast-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  animation-duration: 750ms;
  /* transform: translateY(60px); */
}

#save-shade {
  background-color: rgba(0,0,0,0.5);
  position: fixed;
  color: #862633;
  text-align: center;
  padding-top: 30%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

#zoom{
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  transform-origin: 0% 0% 0px;
}
.print-page {
  width: 215.9mm;
  height: 279.4mm;
  padding: 0.5in;
  margin: 20px;
  border: 1px #d3d3d3 solid;
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  page-break-after: always;
}

.print-page-landscape {
  height: 215.9mm;
  width: 279.4mm;
  padding: 0.5in;
  margin: 20px;
  border: 1px #d3d3d3 solid;
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  page-break-after: always;
}

.print-dwg {
  width: 215.9mm;
  height: 279.4mm;
  margin: 20px;
  border: 1px #d3d3d3 solid;
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  page-break-after: always;
}

.print-dwg-landscape {
  height: 215.9mm;
  width: 279.4mm;
  margin: 20px;
  border: 1px #d3d3d3 solid;
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  page-break-after: always;
}

@page {
  size: US-Letter;
  margin: 0;
}

@media print {

  body * { visibility: hidden; }

  #pg {
    position: initial !important;
    display: initial !important;
  }
  /* #pg { grid-template-columns: 1fr; } */
  /* #pg { overflow: initial !important; } */
  /* #pg-content { overflow: initial !important; } */
  /* #pg-content-shade { display: hidden; } */
  /* .pg-form { display: none !important; } */
  /* .v-toolbar { display: none !important; } */

  .a-content {
    margin: 0px;
    padding: 0px;
  }

  .app-content{
    margin: 0px !important;
    padding: 0px !important;
  }

  .pop-up-nav {
    display: none !important;
  }

  #print-book,
  #print-book * {
    visibility: visible;
  }

  #label-list * { visibility: hidden !important; }
  #pg-bottom-nav { display: none !important; }

  #zoom{
    display: block !important;
    margin: 0px !important;
    width: 215.9mm  !important;
    transform: scale(1)  !important;
    transform-origin: 0% 0% 0px  !important;
  }

  #print-book {
    position: absolute !important;
    top: 0px;
    left: 0px;
    height: 100% !important;
    /* width: 215.9mm; */
    margin: 0px !important;
    padding: 0px !important;
    background-color: #FFF !important;
    overflow: initial !important;
  }
  /* #print-book {
    width: 215.9mm;
    /* background-color: gray;
    position: absolute;
    overflow: initial;
    margin: 0px;
    padding: 0px;
  } */

  .print-page {
    margin: 0;
    padding: 0.3in 0.5in;
    background-color: #FFF;
    border: none;
    box-shadow: none;
    page-break-inside: avoid;
    page-break-after: always;
  }

  .print-page-landscape {
    margin: 0;
    padding: 0.3in 0.5in;
    background-color: #FFF;
    border: none;
    box-shadow: none;
    page-break-inside: avoid;
    page-break-after: always;
    transform-origin: top left;
    transform: rotate(90deg) translateY(-215.9mm);
  }
  .print-dwg {
    margin: 0;
    padding: 0;
    background-color: #FFF;
    border: none;
    box-shadow: none;
    page-break-inside: avoid;
    page-break-after: always;
  }
  .print-dwg-landscape {
    margin: 0;
    padding: 0;
    background-color: #FFF;
    border: none;
    box-shadow: none;
    page-break-inside: avoid;
    page-break-after: always;
    transform-origin: top left;
    transform: rotate(90deg) translateY(-215.9mm);
  }
}

/*
@media print {
  #pg-content {
    margin: 0;
    padding: 0;
    border: none;
    box-shadow: none;
  }

  #pg {
    margin: 0;
    padding: 0;
    border: none;
    box-shadow: none;
  }
} */
.debug { display: none; }

.percent-over { color: rgb(250, 0, 0); font-weight: bold; }
.percent-maxed { color: rgb(240, 0, 0); }
.percent-warn { color: rgb(240, 120, 0); }
.percent-good { color: rgb(0, 120, 0); }
</style>
