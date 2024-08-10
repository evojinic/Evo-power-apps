<template>
  <td>
    <div>
      {{ pOG ? numberFormat(pOG, 2) || '' : '' }} -OG
    </div>
    <div :class="{danger: greaterThan(pLN, pOG)}">
      {{ pOG ? numberFormat(( 1 - pLN/pOG ) * 100, 0) || '' : '' }} %
    </div>
    <div :style="closeColor(pLN, sl)">
      {{ numberFormat(sl, 2) }} -SL
    </div>
    <div :style="closeColor(pLN, pb)">
      {{ numberFormat(pb, 2) }} -GA
    </div>
    <div :style="closeColor(pLN, aMat)">
      <!-- <span v-if="aMatEst">*</span> -->
      {{ numberFormat(aMat, 2) }} -MC
    </div>
  </td>
</template>

<script>
import helpers from '@/_helpers/helpers';

export default {
  name: 'EstimateTable',
  mixins: [helpers],
  props: {
    pLN: { default: '' },
    pOG: { default: '' },
    sl: { default: '' },
    pb: { default: '' },
    aMat: { default: '' },
    aMatEst: { default: false },
  },

  computed: {
    lineStatus() { return this.$store.getters['quote/lineStatus']; },
    priceDist() { return this.$store.getters['account/priceDist']; },
    priceAdmin() { return this.$store.getters['account/priceAdmin']; },
  },

  methods: {
    closeColor(refPrice, coprasPrice) {
      const percentError = Math.abs(refPrice - coprasPrice) / ((refPrice + coprasPrice) / 2);
      // console.log(refPrice, coprasPrice, percentError)
      if (percentError < 0.01) return { 'color': '#4CAF50', 'font-weight': 'bold' };
      if (percentError < 0.1) return { color: '#000' };
      if (percentError < 0.2) return { color: '#777' };
      return {};
    },
  },
};
</script>

<style>
</style>
