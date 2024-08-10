<template>
  <td>
    <div :style="mh_style">
      <span v-if="mhEst">*</span>
      {{ numberFormat(mh, 2) }} -MH
    </div>
    <div :style="lp_style">
      <!-- <span v-if="lpEst">*</span> -->
      {{ numberFormat(lp, 2) }} -LN
    </div>
    <div :style="sp_style">
      <!-- <span v-if="spEst">*</span> -->
      {{ numberFormat(sp, 2) }} -SP
    </div>
    <div :style="ms_style">
      <!-- <span v-if="msEst">*</span> -->
      {{ numberFormat(ms, 2) }} -MP
    </div>
    <div :style="al_style">
      {{ numberFormat(al, 2) }} -AP
    </div>
  </td>
</template>

<script>
import helpers from '@/_helpers/helpers';

export default {
  name: 'EstimateTable',
  mixins: [helpers],
  props: {
    up: { default: '' },
    mh: { default: '' },
    lp: { default: '' },
    sp: { default: '' },
    ms: { default: '' },
    al: { default: '' },
    mhEst: { default: false },
    lpEst: { default: false },
    spEst: { default: false },
    msEst: { default: false },
  },

  computed: {
    lineStatus() { return this.$store.getters['quote/lineStatus']; },
    priceDist() { return this.$store.getters['account/priceDist']; },
    priceAdmin() { return this.$store.getters['account/priceAdmin']; },
    mh_style() { return this.closeColor(this.up, this.mh); },
    lp_style() { return this.closeColor(this.up, this.lp); },
    sp_style() { return this.closeColor(this.up, this.sp); },
    ms_style() { return this.closeColor(this.up, this.ms); },
    al_style() { return this.closeColor(this.up, this.al); },
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
