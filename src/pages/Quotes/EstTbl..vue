<template>
  <div class="EstTbl">
    <v-alert v-if="qItems.length === 0" :value="true" color="light grey" icon="warning">
      Empty Quote
    </v-alert>
    <table style="margin: 5px auto;" v-else>
      <thead>
        <EstTblHeaders />
      </thead>

      <tbody>
        <template v-for="(item, index) of qItems">
          <EstTblRow
            :key="`est-ln-${index}`"
            v-bind="item"
            :index="index"
            :canEditQuote="canEditQuote"
            :class="{ active: editIndexArr.indexOf(index) !== -1 }"
            @lineClick="selectIndex(index)"
          />
          <EstTblRow
            class="disabled"
            v-if="item.fasteners && item.fasteners.state === 'I'"
            :key="`est-ln-${index}-fasteners`"
            v-bind="item.fasteners"
            :index="index"
            :parentQty="Number(item.qty)"
          />
            <!-- :canEditQuote="canEditQuote" -->
            <!-- :class="{ active: editIndexArr.indexOf(index) !== -1 }"
            @lineClick="selectIndex(index)" -->
        </template>
      </tbody>

    </table>
  </div>
</template>

<script>
import helpers from '@/_helpers/helpers';
import EstTblRow from './EstTblRow.vue';
import EstTblHeaders from './EstTblHeaders.vue';

export default {
  name: 'EstTbl',
  mixins: [helpers],
  components: { EstTblRow, EstTblHeaders },
  props: {
    editIndexArr: { type: Array, required: true, twoWay: true },
    canEditQuote: { type: Boolean, required: true },
    loadingQuote: { type: Boolean, default: false },
  },

  data() {
    return {
      selected: [],
      lines: [],
      dialog: false,
    };
  },

  computed: {
    qItems() { return this.$store.getters['quote/qItems']; },
    boltsOnSide() { return this.$store.getters['quote/boltsOnSide']; },
    lineStatus() { return this.$store.getters['quote/lineStatus']; },
    priceDist() { return this.$store.getters['account/priceDist']; },
    priceAdmin() { return this.$store.getters['account/priceAdmin']; },
    brandTitle() { return this.$store.getters['dp/brands/brandTitle']; },
    gTypeTitle() { return this.$store.getters['dp/gTypeTitle']; },
  },

  methods: {
    updateItemQty(payload) { return this.$store.dispatch('quote/updateItemQty', payload); },
    selectIndex(props) { this.$emit('editEditIndex', props, this.editIndexArr.indexOf(props) !== -1); },
  },
};
</script>

<style scoped>
.EstTbl {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  /* font-family: monospace; */
}

table { border-collapse: collapse; color: rgba(0,0,0,0.87); }
thead /deep/ th { padding: 0px 15px; color: rgba(0,0,0,0.54); font-weight: 500; font-size: 12px; }
tbody tr { cursor: pointer; border-top: 1px solid rgba(0,0,0,0.12); }
tbody .active { background: #ffe0b2; box-shadow: inset 0px 0px 7px rgb(0 0 0 / 50%); }
tbody .disabled { background: initial !important; cursor: initial !important; }
tbody tr:hover { background: rgba(134, 38, 51, 0.2); }
tbody /deep/ td { padding: 5px 15px; text-align: right; }
</style>
