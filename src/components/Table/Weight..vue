<template>
  <td v-if="loading" class="txt-right">
    <ga-spinner />
  </td>
  <td v-else-if="error" class="txt-right">
    <div style="font-size: 0.9em">
      weight<br>look up<br>failed
    </div>
  </td>
  <td v-else-if="errors" class="txt-right">
    <div v-if="errors" style="font-size: 0.8em">
      <span style="color: red; font-weight: bold">Missing Weight</span>
      <span v-html="errors" />
    </div>
  </td>
  <td v-else-if="weight" class="txt-right">
    <div v-if="showEach" class="each">{{ unitWeight }}</div>
    <div v-if="showEach && dim1" class="packDims">{{ dim1 }}</div>
    <div v-if="showEach && dim2" class="packDims">{{ dim2 }}</div>
    <div class="net">{{ netPrice }}</div>
  </td>
  <td v-else />
</template>

<script>
export default {
  name: 'td-weight',
  props: {
    qty: { required: true },
    pack: { default() { return []; } },
    showEach: { default: true },
    metric: { type: Boolean, default: false },
  },
  computed: {
    roundTo() {
      if (this.metric) return 0;
      return 1;
    },
    package1() { return this.pack[0] || { weight: 0 }; },
    package2() { return this.pack[1] || { weight: 0 }; },
    loading() { return this.package1.loading || false; },
    error() { return this.package1.error || false; },
    dim1() {
      if (!this.package1 || !this.package1.height) return '';
      // return this.package1;
      const { base, height } = this.package1;
      return `${this.dimCon(base)} x ${this.dimCon(base)} x ${this.dimCon(height, this.lengthRnd)}`;
    },
    dim2() {
      if (!this.package2 || !this.package2.height) return '';
      const { base, height } = this.package2;
      return `${this.dimCon(base)} x ${this.dimCon(base)} x ${this.dimCon(height, this.lengthRnd)}`;
    },
    weight() {
      if (!this.pack) return 0;
      return this.package1.weight + this.package2.weight;
    },
    unitWeight() {
      if (!this.weight) return '-';
      return this.weightFormat(this.weight);
    },
    netPrice() {
      if (this.errors) return '';
      if (!this.weight) return '-';
      return this.weightFormat(this.weight * this.qty);
    },
    errors() {
      const w1 = this.package1.weights || [];
      const w2 = this.package2.weights || [];
      const missing = [].concat(w1.filter(w => w.weight <= 0), w2.filter(w => w.weight <= 0));
      let err = '';
      for (const error of missing) {
        err += `<br>${error.type}`;
        // err += `<br>${error.type} - ${error.pn}`;
      }
      return err;
    },

    // metric conversion
    lengthUnit() { return this.metric ? 'mm' : 'in'; },
    lengthCon() { return this.metric ? 25.4 : 1; },
    lengthRnd() { return this.metric ? 0 : 1; },
    weightUnit() { return this.metric ? 'kg' : 'lb'; },
    weightCon() { return this.metric ? 0.45359237 : 1; },
  },
  methods: {
    dimCon(num, roundTo = 0) {
      const round = 10 ** roundTo;
      return (Math.ceil(num * this.lengthCon * round) / round).toFixed(roundTo);
    },
    weightFormat(num, roundTo = 1) {
      const round = 10 ** roundTo;
      return (Math.ceil(num * this.weightCon * round) / round).toFixed(roundTo);
    },
  },
};
</script>

<style scoped>
.each { font-size: 0.8em; color: #aaa; }
.packDims { color: #aaa; }
.net { font-weight: bold; }
</style>
