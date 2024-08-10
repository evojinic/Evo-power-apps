<template>
  <transition
    v-if="isGetPending"
    name="fast-fade"
  >
    <div
      v-show="isGetPending"
      class="qv-material-loading"
    >
      <ga-spinner />
      <h3 v-if="isGetPending">
        VERIFYING
      </h3>
    </div>
  </transition>
  <transition
    v-else
    name="fast-fade"
  >
    <div class="qv-material-list">
      <div class="qv-material-actions">
        <span class="qv-material-header">MATERIAL VERIFICATION</span> for <span class="qv-material-header">{{ qNumber }}</span>
        <v-btn
          v-if="quote.status !== 'notSaved'"
          small
          color="green"
          @click="saveVerifiedMaterial()"
        >
          <v-icon
            left
            dark
          >
            save
          </v-icon>
          SAVE
        </v-btn>
        <v-btn
          v-if="quote.verify && quote.verify.materials"
          small
          color="red"
          @click="resetVerifiedMaterial()"
        >
          <v-icon
            left
            dark
          >
            delete_forever
          </v-icon>
          RESET
        </v-btn>
        <v-switch
          style="display: inline-block; margin: 0; padding-left: 80px"
          v-model="simplify"
          label="Simplify"
          color="primary"
          dense
          :value="true"
          hide-details
        ></v-switch>
        <v-switch
          style="display: inline-block; margin: 0; padding-left: 80px"
          v-model="editMode"
          label="Edit Mode"
          color="green"
          dense
          :value="true"
          hide-details
        ></v-switch>
      </div>
      <h3
        style="background: #111; color: white; cursor: pointer; padding: 0.5em"
        @click="showInventory = !showInventory"
      >
        <v-icon
          color="white"
          small
        >
          {{ showInventory ? 'expand_more' : 'chevron_right' }}
        </v-icon>Inventory
      </h3>
      <div v-if="showInventory">
        <v-btn
          v-if="!editMode"
          small
          flat
          color="green"
          @click="copyByID('q-verify-material-inventory')"
        >
          <v-icon
            left
            dark
          >
            file_copy
          </v-icon>
          Copy Inventory Table
        </v-btn>
        <table
          id="q-verify-material-inventory"
          class="bomTable"
        >
          <tr class="qv-material-thr">
            <th>Part Num</th>
            <th>Needed</th>
            <th style="color: rgb(47,117,181)">
              On Hand
            </th>
            <th v-if="!simplify">Ordered</th>
            <th v-if="!simplify">WIP</th>
            <th v-if="simplify">Ordered/WIP</th>
            <th style="color: rgb(255,102,0)">
              Total Out
            </th>
            <th v-if="!simplify">Left Overs</th>
            <th v-if="!simplify">Safety Stock</th>
            <th v-if="!simplify">Below</th>
            <th>Rush?</th>
            <th>Notes</th>
            <th>Lead Days</th>
            <th v-if="!simplify">STD $</th>
            <th v-if="!simplify">CUSTOM $</th>
            <th>Lines</th>
          </tr>
          <MaterialRow
            v-for="(material, index) in matInv"
            :key="index"
            :simplify="simplify"
            :material="material"
            :editMode="editMode"
          />
        </table>
      </div>

      <h3
        style="background: #111; color: white; cursor: pointer; padding: 0.5em"
        @click="showNest = !showNest"
      >
        <v-icon
          color="white"
          small
        >
          {{ showNest ? 'expand_more' : 'chevron_right' }}
        </v-icon>Nest / Components, for now
      </h3>
      <div v-if="showNest">
        <v-btn
          v-if="!editMode"
          small
          flat
          color="green"
          @click="copyByID('q-verify-material-nest')"
        >
          <v-icon
            left
            dark
          >
            file_copy
          </v-icon>
          Copy Nest Table
        </v-btn>
        <table
          id="q-verify-material-nest"
          class="bomTable"
        >
          <tr class="qv-material-thr">
            <th>Part Num</th>
            <th>Needed</th>
            <th style="color: rgb(47,117,181)">
              On Hand
            </th>
            <th v-if="!simplify">Ordered</th>
            <th v-if="!simplify">WIP</th>
            <th v-if="simplify">Ordered/WIP</th>
            <th style="color: rgb(255,102,0)">
              Total Out
            </th>
            <th v-if="!simplify">Left Overs</th>
            <th v-if="!simplify">Safety Stock</th>
            <th v-if="!simplify">Below</th>
            <th>Rush?</th>
            <th>Notes</th>
            <th>Lead Days</th>
            <th v-if="!simplify">STD $</th>
            <th v-if="!simplify">CUSTOM $</th>
            <th>Lines</th>
          </tr>
          <MaterialRow
            v-for="(material, index) in matNest"
            :key="index"
            :simplify="simplify"
            :material="material"
            :editMode="editMode"
          />
        </table>
      </div>

      <h3
        style="background: #111; color: white; cursor: pointer; padding: 0.5em"
        @click="showJobs = !showJobs"
      >
        <v-icon
          color="white"
          small
        >
          {{ showJobs ? 'expand_more' : 'chevron_right' }}
        </v-icon>Jobs
      </h3>
      <div v-if="showJobs">
        <v-btn
          v-if="!editMode"
          small
          flat
          color="green"
          @click="copyByID('q-verify-material-jobs')"
        >
          <v-icon
            left
            dark
          >
            file_copy
          </v-icon>
          Copy Jobs Table
        </v-btn>
        <table
          id="q-verify-material-jobs"
          class="bomTable"
        >
          <tr class="qv-material-thr">
            <th>Part Num</th>
            <th>Needed</th>
            <th style="color: rgb(47,117,181)">
              On Hand
            </th>
            <th v-if="!simplify">Ordered</th>
            <th v-if="!simplify">WIP</th>
            <th v-if="simplify">Ordered/WIP</th>
            <th style="color: rgb(255,102,0)">
              Total Out
            </th>
            <th v-if="!simplify">Left Overs</th>
            <th v-if="!simplify">Safety Stock</th>
            <th v-if="!simplify">Below</th>
            <th>Rush?</th>
            <th>Notes</th>
            <th>Lead Days</th>
            <th v-if="!simplify">STD $</th>
            <th v-if="!simplify">CUSTOM $</th>
            <th>Lines</th>
          </tr>
          <MaterialRow
            v-for="(material, index) in matJob"
            :key="index"
            :simplify="simplify"
            :material="material"
            :editMode="editMode"
          />
        </table>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import helpers from '@/_helpers/helpers';
import MaterialRow from './VMaterialRow.vue';

export default {
  name: 'VMaterial',

  components: {
    MaterialRow,
  },

  mixins: [helpers],

  data() {
    return {
      showInventory: true,
      showNest: true,
      showJobs: false,
      editMode: false,
      simplify: true,
    };
  },

  computed: {
    auth_id() { return this.$store.getters['account/auth_id']; },
    ...mapState('quote', ['quote', 'isGetPending']),
    verifiedMaterials() { return this.$store.getters['quote/verifiedMaterials']; },
    qNumber() { return this.$store.getters['quote/qNumber']; },
    matInv() { return this.$store.getters['quote/matInv']; },
    matNest() { return this.$store.getters['quote/matNest']; },
    matJob() { return this.$store.getters['quote/matJob']; },
  },

  methods: {
    ...mapActions('quote', ['updateQuote']),
    saveVerifiedMaterial() {
      this.updateQuote({
        data: {
          '_id': this.qNumber,
          'user_id': this.auth_id,
          'verify.materials': this.auth_id,
          'verifiedMaterials': this.verifiedMaterials,
        },
      });
    },
    resetVerifiedMaterial() {
      this.updateQuote({
        data: {
          '_id': this.qNumber,
          'user_id': this.auth_id,
          'verify.materials': this.auth_id,
          'verifiedMaterials': [],
        },
      });
    },
  },

};
</script>

<style>
.qv-material-loading{
  padding-top: 40px;
  text-align: center;
  color: orange;
}
.qv-material-list{
  width: max-content;
  min-width: 800px;
  margin: auto;
  margin-bottom: 42px;
  overflow: auto;
  background: white;
  /* padding: 21px; */
}
.qv-material-header{
font-weight: bold; font-size: 1.2em
}
.qv-material-thr{
  background-color: rgb(217, 226, 243)
}
.qv-material-actions{
  padding: 0.5em;
}

.bomList {
  list-style: none;
  display: flex;
}
.orderSheet li {
  border: solid black;
  margin: 2px;
  width: 60vw;
}
</style>
