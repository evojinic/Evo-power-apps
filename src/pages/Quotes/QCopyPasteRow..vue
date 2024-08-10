<template>
  <tr>
    <td class="txt-right">{{ ln }}</td>
    <td>{{ pn }}</td>
    <td>
      <span class="desc" v-html="productDescription" />
      <span class="desc" v-html="gasketDescription" />
      <span class="desc" v-html="kitDescription" />
      <span style="color:red" v-html="itemCustomizations" />
      <span class="addition" v-html="itemAdditions" />
    </td>
    <td class="txt-right">{{ torque }}</td>
    <td class="txt-right">{{ qty }}</td>
    <ItemPrice
      :price="p && p.up ? p.up : 0"
      :error="p && p.error ? p.error : ''"
      :qty="1"
      :showEach="false"
      :fasteners="fasteners"
    />
    <ItemPrice
      :price="p && p.up ? p.up : 0"
      :error="p && p.error ? p.error : ''"
      :qty="parentQty ? parentQty * qty : qty"
      :showEach="false"
      :fasteners="fasteners"
    />
  </tr>
</template>

<script>
// import QStatusActions from '@/components/QStatusActions.vue';
import helpers from '@/_helpers/helpers';
import ItemPrice from '@/components/Table/Price.vue';

const boldPattern = str => str.replaceAll('| ', '| <b>').replaceAll(' ::', '</b>');

export default {
  name: 'QCopyPasteRow',
  mixins: [helpers],
  components: { ItemPrice },
  props: {
    ln: { type: String },
    qty: { required: true },
    pn: { type: String, required: true },
    desc: { type: String, default: '' },
    q: { type: Object, default() { return {}; } },
    d: { type: Object, default() { return {}; } },
    p: { type: Object, default() { return {}; } },
    trq: { type: Object, default() { return {}; } },
    error: { type: Object, default() { return {}; } },
    fasteners: { type: Object, default() { return {}; } },
    parentQty: { type: Number, default: 0 },
  },

  computed: {
    brandTitle() { return this.$store.getters['dp/brands/brandTitle']; },
    gTypeTitle() { return this.$store.getters['dp/gTypeTitle']; },
    facingTitle() { return this.$store.getters['dp/facingTitle']; },
    retainerTitle() { return this.$store.getters['dp/retainerTitle']; },
    sealInnerTitle() { return this.$store.getters['dp/seals/sealTitle']; },
    sealOuterTitle() { return this.$store.getters['dp/seals/sealOuterTitle']; },
    sleeveTitle() { return this.$store.getters['dp/sleeves/sleeveTitle']; },
    isoWasherTitle() { return this.$store.getters['dp/isoWashers/isoWasherTitle']; },
    retWasherTitle() { return this.$store.getters['dp/retWashers/retWasherTitle']; },

    descRows() {
      if (this.desc.indexOf(' | ') === -1) return '';
      const rows = this.desc.split('||');
      return rows.map(r => boldPattern(`| ${r}`));
    },

    brandLookUp() {
      if (this.q.brand === 'PW') return this.q.product;
      if (this.q.brand === 'MW') return this.q.product;
      return this.q.brand;
    },
    productDescription() {
      if (!this.q) return '';
      if (this.descRows) return this.descRows[0] ? `${this.descRows[0]}` : '';
      const { gType, nSize, pClass, bore } = this.q;
      const br = this.brandLookUp ? ` |&nbsp;<b>${this.brandTitle(this.brandLookUp)}</b>` : '';
      const c = pClass ? ` - <b>${pClass}</b>` : '';
      const b = bore && bore !== 'NA' ? ` - <b>${bore}</b> bore` : '';
      const gt = gType ? ` |&nbsp;${this.gTypeTitle(gType)}` : '';
      let s = nSize ? `|&nbsp;<b>${nSize}</b>` : '';
      if (this.q.boltSize) s = `|&nbsp;<b>${this.q.boltSize}</b>"`;
      return `${s}${c}${b}${gt}${br} `;
    },

    gasketDescription() {
      if (!this.q) return '';
      if (this.descRows) return this.descRows[1] ? `${this.descRows[1]}` : '';
      const { brand, retMat, seal, seal2, mesh, ringMat } = this.q;
      if (!retMat) return '';
      let type = 'retainer';
      if (ringMat) type = 'core';
      if (brand === 'PW') type = '';
      const c = retMat ? `|&nbsp;<b>${this.retainerTitle(brand, retMat)}</b> ${type}` : '';
      const f = ringMat ? `|&nbsp;<b>${this.facingTitle(ringMat)}</b>&nbsp;facing` : '';
      const s1 = seal ? `|&nbsp;<b>${this.sealInnerTitle(brand, seal)}</b>&nbsp;seal` : '';
      const s2 = seal2 && brand !== 'IGS' ? `|&nbsp;<b>${this.sealOuterTitle(brand, seal2)}</b>&nbsp;outer&nbsp;seal` : '';
      const m = mesh ? `|&nbsp;<b>${mesh}</b>g&nbsp;mesh` : '';
      return `${c} ${f} ${s1} ${s2} ${m} `;
    },

    kitDescription() {
      if (!this.q) return '';
      if (this.descRows) return this.descRows[2] ? `${this.descRows[2]}` : '';
      const xx = this.q.xx || {};
      // const xxKeys = Object.keys(xx);
      const { sleeveM, sleeveL, isoWasher, retWasher, dbl } = this.q;
      const slvLen = isoWasher ? `<b${xx.sleeveL ? ' style="color: red"' : ''}>${sleeveL}</b>" ` : '';
      const sleeve = sleeveM ? `|&nbsp;${slvLen}<b${xx.sleeveM ? ' style="color: red"' : ''}>${this.sleeveTitle(sleeveM)}</b>&nbsp;iso.&nbsp;sleeve ` : '';
      const iso = isoWasher ? `|&nbsp;<b${xx.isoWasher ? ' style="color: red"' : ''}>${this.isoWasherTitle(isoWasher)}</b>&nbsp;iso.&nbsp;wshr ` : '';
      const ret = retWasher ? `|&nbsp;<b${xx.retWasher ? ' style="color: red"' : ''}>${this.retWasherTitle(retWasher)}</b>&nbsp;ret.&nbsp;wshr ` : '';
      let double = '';
      if (dbl !== undefined) {
        double = dbl ? `|&nbsp;<b${xx.dbl ? ' style="color: red"' : ''}>DBL</b> set` : `|&nbsp;<b${xx.dbl === false ? ' style="color: red"' : ''}>SGL</b>&nbsp;set`;
      }
      return `${sleeve}${iso}${ret}${double} `;
    },

    itemCustomizations() {
      if (!this.q) return '';
      if (!this.q.xx) return '';
      const customizationKeys = Object.keys(this.q.xx) || [];
      if (customizationKeys.length === 0) return '';
      const doNotShow = ['swSet', 'sleeveL', 'sleeveM', 'isoWasher', 'retWasher', 'dbl'];
      let xx = '>> <b>custom</b> ';
      if (this.q.xx.label && this.q.xx.label === this.q.xx.laser) {
        xx += ` |&nbsp;laser & label: <b>${this.q.xx.label}</b>`;
        doNotShow.push('laser');
        doNotShow.push('label');
      }
      for (const key of customizationKeys) {
        if (doNotShow.indexOf(key) !== -1) continue;
        const val = this.q.xx[key];
        if (val === true || val === false) xx += ` | <b>${key}</b>`;
        else xx += ` |&nbsp;${key}: <b>${val}</b> `;
      }
      return xx;
    },

    torque() {
      if (this.trq) {
        const trq = this.trqData(this);
        if (trq) {
          const { sug } = trq.trqR;
          return `${Math.round(sug.torque.val)} ${sug.torque.unit.replace(/ /g, '')}`;
        }
      }
      return '';
    },

    itemAdditions() {
      if (!this.fasteners) return '';
      if (this.fasteners.state !== 'S') return '';
      if (!this.fasteners.q) return '';
      const { pn: fPN, qty: fQty, q: fQ, p: fP } = this.fasteners;
      const { len, mat, nutMat } = fQ;
      return `<br><b>ADD ${len.toFixed(2)}" long ${mat}</b> stud & <b>${nutMat}</b> 2 nuts for $ <b>${fP.up}</b> x <b>${fQty}</b> / line pn <b>${fPN}</b>`;
    },
  },
};
</script>

<style scoped>
.q-cp-copy th,td { padding: 4px 8px; }

.desc { color: #777; }
.desc b { color: #111; font-weight: 500; }

.addition { color: #777 }
.addition b { color: #006298; font-weight: 500; }

.txt-right { text-align: right; }
</style>
