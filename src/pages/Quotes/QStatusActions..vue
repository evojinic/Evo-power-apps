<template>
  <div class="QStatusActions">
    <div v-if="header">
      <QCard :quote="editQuote" :show-actions="false" :show-history="true"/>
    </div>

    <v-form
      v-if="currentStatus === 'new'"
      class="q-status-form"
    >
      <v-text-field
        v-model="contactEmail"
        style="min-width: 270px"
        label="Optional Customer's Email, for reference"
        placeholder="optional_customer@company.com"
        required
      />
      <!-- :disabled="!validEmail"  -->
      <v-btn color="success" @click="customerContacted" round>Status to Pending</v-btn>
    </v-form>

    <v-form
      v-if="currentStatus === 'pending'"
      class="q-status-form"
      :value="validPO"
    >
      <v-text-field
        v-model="poNumber"
        style="min-width: 270px"
        label="Purchase Order Number (PO)"
        :rules="[validPO || 'Can not be blank']"
        required
      />
      <!-- :disabled="!validPO"  -->
      <v-btn color="success" @click="poReceived" round>Status -> In Process</v-btn>
    </v-form>

    <v-form
      v-if="currentStatus === 'pending'"
      class="q-status-form"
      :value="validReason"
    >
      <v-select
        v-model="missedReason"
        label="Quote Missed Because"
        :items="missedReasons"
        :rules="[validReason || 'Reason is required']"
        required
      />
      <!-- :disabled="!validReason"  -->
      <v-btn color="warning" @click="quoteMissed" round>Status -> Missed Out</v-btn>
    </v-form>

    <v-form
      v-if="currentStatus === 'inProcess'"
      class="q-status-form"
      :value="validOrderNumber"
    >
      <v-text-field
        v-model="orderNumber"
        label="Production Order Number"
        :rules="[validOrderNumber || 'Must be 10 characters long']"
        :counter="10"
        required
      />
      <!-- :disabled="!validOrderNumber"  -->
      <v-btn color="success" @click="orderEntered" round>Status -> in Process</v-btn>
    </v-form>

    <v-form
      v-if="currentStatus === 'inProduction'"
      class="q-status-form"
      :value="validTrackingNumber"
    >
      <v-text-field
        v-model="trackingNumber"
        label="Tracking Number"
        :rules="[validTrackingNumber || 'Can not be blank']"
        required
      />
      <!-- :disabled="!validTrackingNumber"  -->
      <v-btn color="success" @click="orderShipped" round>Status -> Shipped</v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import QCard from './QuoteCard.vue';

export default {
  name: 'QStatusActions',
  components: { QCard },
  props: {
    quote: { type: Object, required: true },
    currentStatus: { type: String, required: true },
    header: { type: Boolean, default: false },
  },

  data() {
    return {
      validEmail: true,
      validReason: true,
      validPO: true,
      validOrderNumber: true,
      validTrackingNumber: true,
      contactEmail: '',
      missedReason: '',
      missedReasons: [
        'The Lead time was too long',
        'The Price was too high',
        'I did not fallow up',
        'I did not get a response',
        'Other',
      ],
      poNumber: '',
      orderNumber: '',
      trackingNumber: '',
    };
  },

  // watch: {  },

  computed: {
    ...mapState('quote', { updatingQuote: 'isUpdatePending' }),
    ...mapState('quote', { editQuote: 'quote' }),
    ...mapGetters('account', ['isDev', 'auth_id']),
  },

  methods: {
    ...mapActions('quote', ['updateQuote']),
    // contact email
    validateEmail() {
      if (this.contactEmail === '') this.validEmail = false;
      else {
        // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.validEmail = re.test(this.contactEmail);
      }
    },
    customerContacted() {
      this.validateEmail();
      // if (this.validEmail) {
      // console.log("contacted");
      const updateData = { user_id: this.auth_id };
      updateData.status = 'pending';
      updateData.customerContact = this.contactEmail || 'blank';
      // updateData.lastContact = this.lastContact;
      this.patchQuote(updateData);
      this.contactEmail = '';
      // }
    },
    // miss reason
    validateReason() {
      this.validReason = this.missedReason !== '';
    },
    quoteMissed() {
      this.validateReason();
      if (this.validReason) {
        // console.log('missed reason');
        const updateData = { user_id: this.auth_id };
        // let updateData = { history: this.editQuote.history }
        updateData.status = 'missed';
        updateData.missed = this.missedReason;
        this.patchQuote(updateData);
        this.missedReason = '';
      }
      // else console.log("missing a reason");
    },
    // purchase order PO
    validatePO() {
      this.validPO = this.poNumber !== '';
    },
    poReceived() {
      this.validatePO();
      if (this.validPO) {
        const updateData = { user_id: this.auth_id };
        updateData.po = this.poNumber;
        updateData.status = 'inProcess';
        this.patchQuote(updateData);
        this.poNumber = '';
      }
    },
    // order number
    validateOrderNumber() {
      if (this.orderNumber === '') this.validOrderNumber = false;
      else if (this.orderNumber.length !== 10) this.validOrderNumber = false;
      else this.validOrderNumber = true;
    },
    orderEntered() {
      this.validateOrderNumber();
      if (this.validOrderNumber) {
        // console.log('order entered');
        const updateData = { user_id: this.auth_id };
        updateData.order = this.orderNumber;
        updateData.status = 'inProduction';
        this.patchQuote(updateData);
        this.orderNumber = '';
      }
    },
    // tracking number
    validateTrackingNumber() {
      this.validTrackingNumber = this.trackingNumber !== '';
    },
    orderShipped() {
      this.validateTrackingNumber();
      if (this.validTrackingNumber) {
        // console.log('order entered');
        const updateData = { user_id: this.auth_id };
        updateData.trackingNumber = this.trackingNumber;
        updateData.shipDate = new Date();
        updateData.status = 'shipped';
        this.patchQuote(updateData);
        this.trackingNumber = '';
      }
    },
    patchQuote(updateData) {
      // console.log(updateData);
      if (this.editQuote._id) {
        const data = updateData;
        data._id = this.editQuote._id;
        this.updateQuote({ data });
      }
    },
  },
};
</script>

<style>
.q-status-form {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
}
</style>
