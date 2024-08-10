<template>
  <div class="q-cp">
    <!-- class="vq-status-content" -->
    <!--
    <q-status-actions
      :header="true"
      :quote="quote"
      :currentStatus="quote.status"
    />

     -->
    <div class="q-cp-block" style="max-width: 650px" v-if="quote.status === 'new'">
      <v-form
        class="q-status-form"
      >
        <v-text-field
          v-model="contactEmail"
          style="min-width: 270px"
          label="Optional Customer's Email"
          placeholder="optional_customer_email@company.com"
          hide-details
        />
        <!-- :disabled="!validEmail"  -->
        <v-btn color="success" @click="customerContacted" round>Move Quote Status to Pending</v-btn>
      </v-form>
      <div>NOTE once moved to pending, a 30 Day countdown will start and will let you know when the quote has expired</div>
    </div>
    <div class="q-cp-block" style="max-width: 300px">
      <SideOfBolts />
    </div>
    <div id="cp-all" class="q-cp-copy">
      <table @click="copyByID('cp-all')">
        <tr>
          <td>
            <img
              :src="'/img/isotek_200x70.png'"
              height="42"
            >
        <!-- <p>
          7300 Airport Blvd.
          Houston, TX 77061
        </p> -->
          </td>
          <td style="width: 100px"></td>
          <td></td>
        </tr>
        <tr>
          <td>
            <table>
              <tr>
                <td class="txt-right q-header-exp">Last Update:</td>
                <td>{{ lastUpdatedDate }}</td>
              </tr>
              <tr>
                <td class="txt-right q-header-exp">Quote Number:</td>
                <td>{{ quote._id }}</td>
              </tr>
              <tr>
                <td class="txt-right q-header-exp">Customer Name:</td>
                <td>{{ quote.qData.customer }}</td>
              </tr>
              <tr>
                <td class="txt-right q-header-exp">Job / Project:</td>
                <td>{{ quote.qData.job }}</td>
              </tr>
              <tr>
                <td class="txt-right q-header-exp">Quote Total Price:</td>
                <td>${{ totalPrice }}</td>
              </tr>
              <tr class="q-promo" v-if="showWaterMarketDiscount">
                <td class="txt-right">ORDER IN 48HRS PROMO Price:</td>
                <td>${{ discountPrice }} (Additional 5% Discount)</td>
              </tr>
              <tr>
                <td class="txt-right q-header-exp">Quote Lead Time:</td>
                <td>CONTACT Lamons Houston for lead time </td>
              </tr>
              <tr>
                <td class="txt-right q-header-exp">Quote Validity:</td>
                <td>10 Days</td>
              </tr>
            </table>
          </td>
          <td>
          </td>
          <td>
            <table>
              <tr>
                <td class="txt-right q-header-exp">Representative:</td>
                <td>{{ user.displayName }}</td>
              </tr>
              <tr>
                <td class="txt-right q-header-exp">Email:</td>
                <td><a :href="`mailto:${user.email}`">{{ user.email }}</a></td>
              </tr>
              <tr>
                <td class="txt-right q-header-exp">Address:</td>
                <td>{{ user.address.line1 }}</td>
              </tr>
              <tr><td class="txt-right q-header-exp" /><td>{{ user.address.line2 }}</td></tr>
              <tr>
                <td class="txt-right q-header-exp">Primary:</td>
                <td><a :href="`tel:${user.phone.primary}`">{{ user.phone.primary }}</a></td>
              </tr>
              <tr v-if="user.phone.alternative">
                <td class="txt-right q-header-exp">Alternative:</td>
                <td><a :href="`tel:${user.phone.alternative}`">{{ user.phone.alternative }}</a></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <br>
      <div id="cp-items" @click="copyByID('cp-items')">
        <table class="q-cp-items">
          <tr>
            <th
              v-for="(header) of this.printHeaders"
              :key="header.text"
              class="q-cp-header"
              :style="header.width ? `width: ${header.width}` : ''"
            >
              {{ header.text }}
            </th>
          </tr>
          <template v-for="(item,index) of this.quote.qItems">
            <CPRow :key="`cp-ln-${index}`" v-bind="item" />
            <CPRow :key="`cp-ln-${index}-fst`" v-bind="item.fasteners" v-if="item.fasteners && item.fasteners.state === 'I'" :parentQty="Number(item.qty)" />
          </template>
          <tr>
            <td />
            <td />
            <td />
            <td />
            <td />
            <td class="txt-right q-header-exp">TOTAL</td>
            <td class="txt-right"><b>${{ totalPrice }}</b></td>
          </tr>
          <tr v-if="totalAddon">
            <td />
            <td />
            <td />
            <td />
            <td />
            <td class="txt-right q-header-exp q-addon">FASTENERS</td>
            <td class="txt-right q-addon"><b>+${{ totalAddon }}</b></td>
          </tr>
          <tr v-if="showWaterMarketDiscount">
            <td />
            <td />
            <td />
            <td class="txt-right q-promo">ORDER IN 48HRS</td>
            <td class="txt-right q-promo">5% OFF</td>
            <td class="txt-right q-header-exp">PROMO TOTAL</td>
            <td class="txt-right q-promo"><b>${{ discountPrice }}</b></td>
          </tr>
        </table>

        <br>

        <div v-if="torqueDisclaimer">
          {{ torqueDisclaimer }}
        </div>
        <br>
        <div v-if="modularDisclaimer">
          {{ modularDisclaimer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import QStatusActions from '@/components/QStatusActions.vue';
import helpers from '@/_helpers/helpers';
import CPRow from '@/pages/Quotes/QCopyPasteRow.vue';
import SideOfBolts from '@/pages/Quotes/SideOfBolts.vue';

export default {
  name: 'QCopyPaste',
  mixins: [helpers],
  components: { CPRow, SideOfBolts },
  props: {
    quote: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      contactEmail: '',
      printHeaders: [
        {
          text: 'LN#',
          width: '5px',
          align: 'left',
        },
        {
          text: 'PART NUMBER',
          width: '230px',
          align: 'left',
        },
        {
          text: 'DESCRIPTION',
          align: 'left',
        },
        {
          text: 'SUG-TRQ',
          width: '120px',
          align: 'right',
        },
        {
          text: 'QTY',
          width: '60px',
          align: 'right',
        },
        {
          text: 'USD EACH',
          width: '80px',
          align: 'right',
        },
        {
          text: 'USD NET',
          width: '80px',
          align: 'right',
        },
      ],
    };
  },

  destroyed() {
    this.contactEmail = '';
  },

  computed: {
    company() { return 'LAMONS'; },
    rightNow() {
      const d = new Date();
      return d.toLocaleString();
    },
    lastUpdatedDate() {
      const d = new Date(this.quote.updatedAt);
      return d.toLocaleString();
    },
    showWaterMarketDiscount() {
      return this.$store.getters['account/distDNV'] && this.$store.getters['quote/waterMarketDiscount'];
    },
    totalPrice() { return this.numberFormat(this.quote.qData.priceNet, 2); },
    discountPrice() { return this.numberFormat(this.quote.qData.priceNet * 0.95, 2); },
    torqueDisclaimer() {
      const firstTrq = this.quote.qItems.find(i => i.trq && i.trq.torqueDisclaimer && i.q.product && i.q.product !== 'modular');
      if (!firstTrq) return '';
      return firstTrq.trq.torqueDisclaimer;
    },
    modularDisclaimer() {
      const firstTrq = this.quote.qItems.find(i => i.q && i.q.product && i.q.product === 'modular');
      if (!firstTrq) return '';
      return 'Lamons does not take responsibility for Lamons Pressio Modular Seal Installation/Performance. Installers must refer to installation instructions. Pressio modular seals are manufactured by 4pipes GmbH, assembled by Lamons IsoTek U.S.A. Lamons Pressio modular seals are rated to 20psig (40 Feet Static Head), pipe must be centered/supported, and bolts shall be tightened with a torque wrench, never with power tools. Returns: Re-stocking charge, 50% of order value, shipping paid by customer. Product may not be returned if subject to being in field.';
    },
    totalAddon() {
      const total = this.quote.qItems.reduce((t, i) => {
        if (!i.d) return t;
        if (!i.fasteners) return t;
        if (i.fasteners.state !== 'S') return t;
        if (!i.fasteners.p) return t;
        const addon = i.fasteners.qty * (i.fasteners.p.up || i.fasteners.p.sp || 0) * i.qty;
        return t + addon;
      }, 0);
      return this.numberFormat(total, 2);
    },
  },

  methods: {
    customerContacted() {
      const updateData = { user_id: this.auth_id };
      updateData.status = 'pending';
      updateData.customerContact = this.contactEmail || 'blank';
      this.patchQuote(updateData);
      this.contactEmail = '';
    },
    patchQuote(updateData) {
      // console.log(updateData);
      if (this.quote._id) {
        const data = updateData;
        data._id = this.quote._id;
        this.$store.dispatch('quote/updateQuote', { data });
      }
    },
  },

};
</script>

<style scoped>
.q-cp {
  width: 98%; max-width: 1100px; margin: 0 auto 42px auto; overflow: auto;
  display: flex; flex-wrap: wrap; justify-content: space-between;
}
.q-cp-block { background-color: white; padding: 1em; margin-bottom: 2em; }

.q-cp-copy { padding: 2rem; background: white; }
.q-promo { font-weight: bold; color: #62B76C}
.q-addon { color: #006298; }
.q-cp-copy th,td { padding: 4px 8px; }
.q-cp-items { font-family: monospace; }
.q-cp-items tr:nth-child(even) { background: #EEE; }
.q-cp-header { background-color: #862633; color: white; padding: 4px 8px; }
.txt-right { text-align: right; }
</style>
