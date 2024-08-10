<template>
  <td v-if="price" class="txt-right">
    <div v-if="costError">
      <span style="color: red; font-weight: bold">Pricing Error(s)</span>
      <span v-html="costError" />
    </div>
    <div v-else-if="showEach" class="each">{{ unitPrice }}{{ product === 'isoTube' ? ' per FT' : '' }}</div>
    <div class="net">{{ netPrice }}</div>
    <div class="addition ">{{ boltAddon }}</div>
  </td>
  <td v-else />
</template>

<script>
import helpers from '@/_helpers/helpers';

export default {
  name: 'td-price',
  mixins: [helpers],
  props: {
    qty: { required: true },
    price: { required: true },
    fasteners: { required: false },
    error: { default: '' },
    product: { default: '' },
    showEach: { default: true },
  },
  computed: {
    boltsOnSide() { return this.$store.getters['quote/boltsOnSide']; },
    unitPrice() {
      if (!this.price) return '-';
      // if (this.qty === 1) return '-';
      return this.numberFormat(this.price, 2);
    },
    netPrice() {
      if (this.costError) return '';
      if (!this.price) return '-';
      if (this.price === 'Contact Lamons') return 'ISOTEK';
      if (this.price === 'Contact') return 'LAMONS';
      return this.numberFormat(this.price * this.qty, 2);
    },
    costError() {
      if (!this.error) return '';
      let err = '';
      for (const error of this.error) {
        err += `<br>${error.pn}`;
        // err += `<br>${error.pn} - ${error.error}`;
      }
      return err;
    },
    boltAddon() {
      if (!this.fasteners) return '';
      // if (!this.boltsOnSide !== 'S') return '';
      if (this.fasteners.state !== 'S') return '';
      if (!this.fasteners.p) return '';
      if (isNaN(this.fasteners.p.up)) return 'TBD';
      const netPrice = this.fasteners.qty * (this.fasteners.p.up || this.fasteners.p.ms || 0) * this.qty;
      return `+${netPrice.toFixed(2)}`;
    },
  },

};
</script>

<style scoped>
.each { font-size: 0.8em; color: #aaa; }
.net { font-weight: bold; }
.addition { font-size: 0.8em; color: #006298; padding-top: 4px; font-weight: 500; }
</style>
