<template>
  <!-- <v-card class="q-card no-select" @click.native="statusUpdate"> -->
  <v-card class="q-card">
    <div
      style="cursor: pointer;"
      @click="showActions = !showActions"
    >
      <div class="q-card-details">
        <div class="q-card-title">
          {{ quote.qData.customer }}
        </div>
        <div class="q-card-id">
          <div v-if="!orderNumber">{{ quoteDate }}</div>
          <div v-if="orderNumber">{{ orderNumber }}</div>
          {{ quote._id }}
        </div>
      </div>

      <div
        class="q-card-divider"
        :class="[ backgroundColor ]"
      />

      <div class="q-card-details">
        <!--
            <div v-if="quote.qData.order" class="q-card-data">{{ quote.qData.order }}</div>
            <div v-if="quote.qData.order" class="q-card-exp">Order # (Production)</div>
            -->
        <div
          v-if="quote.qData.po"
          class="q-card-data"
        >
          {{ quote.qData.po }}
        </div>
        <div
          v-if="quote.qData.po"
          class="q-card-exp"
        >
          Purchase Order #
        </div>

        <div
          v-if="quote.qData.job"
          class="q-card-data"
        >
          {{ quote.qData.job }}
        </div>
        <div
          v-if="quote.qData.job"
          class="q-card-exp"
        >
          Job / Project
        </div>

        <div
          v-if="quote.trackingNumber"
          class="q-card-data"
        >
          {{ quote.trackingNumber }}
        </div>
        <div
          v-if="quote.trackingNumber"
          class="q-card-exp"
        >
          Tracking #
        </div>
        <!--
            <div class="q-card-data">{{ quote.qData.customer }}</div>
            <div class="q-card-exp">Customer</div>
            -->
        <div class="q-card-data">
          $ {{ numberFormat(quote.qData.priceNet, 2) }}
        </div>
        <div class="q-card-exp">
          Net Price
        </div>

        <!--
            <div class="q-card-data">{{ formatDate(quote.createdAt) }}</div>
            <div class="q-card-exp">Create Date</div>

            <div class="q-card-data">{{ formatDate(quote.updatedAt) }}</div>
            <div class="q-card-exp">Modified Date</div>
            -->
      </div>
    </div>
    <div
      v-if="showHistory"
      class="q-card-history"
    >
      <table>
        <!-- <tr>
                <td>{{ formatDate(quote.updatedAt) }}</td>
                <td>Last Update</td>
            </tr> -->
        <tr>
          <td>{{ formatDate(quote.createdAt) }}</td>
          <td>Create Date</td>
        </tr>
        <tr
          v-for="(stamp,index) in quote.history"
          :key="index"
        >
          <td>{{ formatDate(stamp.stamp) }}</td>
          <td>{{ stamp.msg }}</td>
        </tr>
      </table>
    </div>

    <div
      v-if="showActions"
      class="q-card-actions"
      @click.stop
    >
      <v-spacer />
      <v-tooltip bottom>
        <v-btn
          slot="activator"
          small
          icon
          :to="{ path: `/p/q/${quote._id}` }"
        >
          <v-icon color="primary">print</v-icon>
        </v-btn>
        <span>Print Quote</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          v-if="canEditQuote"
          slot="activator"
          small
          icon
          :to="{ path: `/estimator/${quote._id}` }"
        >
          <v-icon color="green">
            edit
          </v-icon>
        </v-btn>
        <span>Edit Quote</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          slot="activator"
          small
          icon
          @click="quoteAction('copyPaste')"
        >
          <v-icon>file_copy</v-icon>
        </v-btn>
        <span>Quote Copy/Paste</span>
      </v-tooltip>
      <!--
        <v-btn small icon @click="quoteAction('delete')">
            <v-icon>delete</v-icon>
        </v-btn>
        -->
      <v-tooltip bottom>
        <v-btn
          slot="activator"
          small
          icon
          @click="quoteAction('statusUpdate')"
        >
          <v-icon>traffic</v-icon>
        </v-btn>
        <span>Status Update</span>
      </v-tooltip>

      <v-tooltip
        v-if="roleBOM"
        bottom
      >
        <v-btn
          slot="activator"
          small
          icon
          @click="quoteAction('BOM')"
        >
          <v-icon>compare</v-icon>
        </v-btn>
        <span>BOM</span>
      </v-tooltip>

      <v-tooltip
        v-if="roleINV"
        bottom
      >
        <v-btn
          slot="activator"
          small
          icon
          @click="quoteAction('verifyMaterial')"
        >
          <v-icon>flare</v-icon>
        </v-btn>
        <span>Material Verification</span>
      </v-tooltip>

      <!--
        <v-btn small icon @click="quoteAction('status')">
            <v-icon color="primary">more_vert</v-icon>
        </v-btn>
        -->
    </div>
  </v-card>
</template>

<script>
import helpers from '@/_helpers/helpers';
import { mapGetters } from 'vuex';

export default {

  name: 'QuoteCard',

  mixins: [helpers],

  props: {
    quote: {
      type: Object,
      required: true,
    },
    // showActions: {
    //     type: Boolean,
    //     default: true
    // },
    showHistory: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      showActions: false,
    };
  },

  // watch: { },

  computed: {
    ...mapGetters('account', [
      'roleBOM',
      'roleINV',
      'userName',
    ]),
    quoteDate() {
      const date = new Date(this.quote.createdAt);
      return date.toLocaleDateString();
    },
    canEditQuote() {
      return (
        this.quote.status === 'notSaved' ||
        this.quote.status === 'new' ||
        this.quote.status === 'pending'
      );
    },
    orderNumber() {
      return this.quote.order || this.quote.qData.order || '';
    },
    backgroundColor() {
      const brands = [];
      if (!this.quote.qSliders) return '';
      for (const slider of this.quote.qSliders) {
        if (!slider.brand) {
          // console.log(this.quote);
        }
        else if (brands.indexOf(slider.brand) === -1) {
          brands.push(slider.brand);
        }
      }
      if (brands.length > 1) {
        return 'MIX-fill';
      }
      if (brands.length === 1) {
        return `${brands[0]}-fill`;
      }
      return 'unknown-fill';
    },
  },

  // methods: { },

  methods: {
    quoteAction(action) {
      this.$emit('quoteAction', action, this.quote._id);
    },
  },

};
</script>

<style>
.q-card{
    width: 290px;
    margin: 0.4rem;
    /* float: left; */
}
.q-card-divider{
    grid-area: 'divider';
    grid-column: 1 / 3;
    padding: 0.1rem;
}
.q-card-title{
    float: left;
    font-size: 1.2rem;
    font-weight: bold;
}
.q-card-id{
    float: right;
    text-align: right;
}
.q-card-details{
    width: 100%;
    padding: 0.4rem;
    display: grid;
    /* justify-items: end; */
    align-items: center;
    grid-template-columns: auto auto;
}
.q-card-history{
  max-height: 300px;
  overflow-y: auto;
  font-size: 0.8em;
  padding: 0.3rem;
}
.q-card-history td {
  padding: 2px;
}
.q-card-exp{
    font-size: 0.8em;
    text-align: right;
}
.q-card-data{
    font-weight: bold;
}
.q-card-actions{
    grid-area: 'actions';
    grid-column: 1 / 3;
    text-align: center;
    cursor: initial;
    /* border-top: #AAA solid 1px; */
}

.DFS-fill {background-color: #FB4;}
.CG-fill {background-color: #59F; color: white}
.DF-fill {background-color: #59F; color: white}
.PG-fill {background-color: #2B9}
.IG-fill {background-color: #2B9}
.FM-fill {background-color: #B8B; }
.IM-fill {background-color: #B8B; }
.PH-fill {background-color: #865; color: white}
.KITS-fill {background-color: #7D7;}
.RAW-fill {background-color: #BBB;}
.MIX-fill {background-color: #888;}
.unknown-fill {background-color: #444; color:white}
</style>
