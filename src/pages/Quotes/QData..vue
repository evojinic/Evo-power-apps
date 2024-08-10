<template>
  <div class="qData">
    <div class="qDataText">
      <v-text-field
        v-if="quote._id"
        v-model="quote._id"
        label="Quote Number"
        placeholder="Quote Number"
        :counter="10"
        style="max-width:130px"
        disabled
      />
    </div>

    <div class="qDataText">
      <v-select
        v-model="quote.status"
        label="Quote Status"
        :items="statusList"
        dense
        style="width:120px"
        disabled
      />
    </div>

    <div v-if="poNumber" class="qDataText">
      <v-text-field
        v-model="poNumber"
        label="PO Number"
        placeholder="PO Number"
        style="max-width:130px"
        disabled
      />
    </div>

    <div v-if="orderNumber" class="qDataText">
      <v-text-field
        v-model="orderNumber"
        label="Order Number"
        placeholder="Order Number"
        :counter="10"
        style="max-width:130px"
        disabled
      />
    </div>

    <div v-if="trackingNumber" class="qDataText">
      <v-text-field
        v-model="trackingNumber"
        label="Tracking Number"
        placeholder="Tracking Number"
        style="max-width:200px"
        disabled
      />
    </div>

    <div class="qData-flexBreak" />

    <div class="qDataText">
      <v-text-field v-if="disabledOriginAccess"
        value=""
        label="Quote Origin"
        style="min-width:260px"
        placeholder="Has been set by higher level access"
        disabled
      />
      <v-select v-else
        label="Quote Origin"
        v-model="dist"
        :items="distSelection"
        :rules="[v => !!v || 'Access level is required']"
        :disabled="disabledOrigin"
        required
        style="max-width:260px"
      />
    </div>

    <div class="qDataText">
      <v-text-field
        v-model="customer"
        label="Customer Name"
        style="min-width:260px"
        placeholder="Customer Name is required to save"
        :rules="nameRules"
        :counter="40"
        required
      />
    </div>

    <div class="qDataText">
      <v-text-field
        v-model="job"
        label="Job / Project"
        style="min-width:260px"
        placeholder="Job / Project is optional"
        :rules="jobRules"
        :counter="40"
      />
    </div>
  </div>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';

export default {

  name: 'QData',

  // components:{},

  // props: {},

  data() {
    return {
      statusDisabled: false,
      nameRules: [
        v => v !== '' || 'Customer Name is required',
        v => v && v.length <= 40 || 'Customer Name must be less than 40 characters',
      ],
      originRules: [
        v => v !== '' || 'Customer Name is required',
        v => v && v.length <= 40 || 'Customer Name must be less than 40 characters',
      ],
      jobRules: [
        // v => !!v || "Job/Project Name is required",
        v => v.length <= 40 || 'Job/Project Name must be less than 40 characters',
      ],
      statusList: [
        'notSaved',
        'new',
        'pending',
        'missed',
        'inProcess',
        'inProduction',
        'shipped',
      ],
    };
  },

  created() {
    if (this.distSelection.length === 0) {
      this.getDistList();
    }
  },

  watch: {
    dist: {
      handler: 'isOriginBlank',
      immediate: true,
    },
  },

  computed: {
    ...mapState('quote', ['quote', 'customer', 'canSave']),
    ...mapState('account', ['user']),
    ...mapGetters('dist', ['distSelection']),
    ...mapGetters('quote', [
      'lastUpdatedDate',
      'leadTime',
      'headerTitle',
      'headerNumber',
      'poNumber',
      'orderNumber',
      'trackingNumber',
      'shipDate',
    ]),
    customer: {
      get() {
        return this.quote.qData.customer;
      },
      set(customer) {
        this.UPDATE_CUSTOMER(customer);
      },
    },
    job: {
      get() {
        return this.quote.qData.job;
      },
      set(job) {
        this.UPDATE_JOB(job);
      },
    },
    dist: {
      get() {
        return this.quote.dist;
      },
      set(dist) {
        this.updateOrigin(dist);
      },
    },
    disabledOrigin() {
      return this.distSelection.length === 1 || this.distSelection.length === 0;
    },
    disabledOriginAccess() {
      return this.disabledOrigin && this.dist !== this.user.dist;
    },
  },

  // computed: { },

  methods: {
    ...mapActions('dist', ['getDistList']),
    ...mapActions('quote', ['updateOrigin']),
    ...mapMutations('quote', ['UPDATE_CUSTOMER', 'UPDATE_JOB']),
    isOriginBlank() {
      if (!this.dist) this.updateOrigin(this.user.dist);
    },
  },

};
</script>

<style>
.qData{
  display: flex;
  /* flex-direction: column; */
  flex-wrap: wrap;
  justify-content: center;
}
.qDataText{
  /* min-width: 320px; */
  padding: 0px 5px;
}

@media only screen and (max-width: 900px){
  .qData-flexBreak {
    width: 100%;
  }
}
</style>
