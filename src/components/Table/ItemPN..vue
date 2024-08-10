<template>
  <td v-if="error" style="padding: 2px 2px 2px 0">
    <div class="pnTitle">{{ pn }}</div>
    <div v-if="error" style="color: red">
      <span v-if="typeof error === 'string'">{{ error }}</span>
      <span v-else v-for="(error, index) of error" :key="'err-'+index">
        {{ error.type }} : {{ error.exp }}
      </span>
    </div>
  </td>
  <td v-else style="padding: 2px 2px 2px 0">
    <div class="pnTitle">{{ pn }}</div>
    <div class="desc" v-if="d">
      <span v-html="productDescription" />
      <span v-html="gasketDescription" />
      <span v-html="kitDescription" />
    </div>
    <div class="desc" v-else>
      {{ desc }}
    </div>
    <div class="custom" v-html="itemCustomizations" />
    <div class="addition" v-html="itemAdditions" />
    <div v-if="showTorque" style="color: #999" v-html="torque"></div>
  </td>
</template>

<script>
import helpers from '@/_helpers/helpers';

const boldPattern = str => str.replaceAll('| ', '| <b>').replaceAll(' ::', '</b>');

export default {
  name: 'ItemTdPn',
  mixins: [helpers],
  props: {
    pn: { type: [String, Object] },
    desc: { type: String },
    q: { type: Object, default() { return {}; } },
    d: { type: Object, default() { return {}; } },
    trq: { type: Object, default() { return {}; } },
    error: { type: [String, Array], default: '' },
    fasteners: { type: Object, default() { return {}; } },
    showTorque: { type: Boolean, default: false },
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
      if (!this.desc) return '';
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
      if (!this.descRows) return this.desc || '';
      if (this.descRows) return this.descRows[0] ? `${this.descRows[0]}<br>` : '';
      const { gType, nSize, pClass, bore } = this.q;
      const br = this.brandLookUp ? ` |&nbsp;<b>${this.brandTitle(this.brandLookUp)}</b>` : '';
      const c = pClass ? ` - <b>${pClass}</b>` : '';
      const b = bore && bore !== 'NA' ? ` - <b>${bore}</b> bore` : '';
      const gt = gType ? ` |&nbsp;${this.gTypeTitle(gType)}` : '';
      let s = nSize ? `|&nbsp;<b>${nSize}</b>` : '';
      if (this.q.boltSize) s = `|&nbsp;<b>${this.q.boltSize}</b>"`;
      return `${s}${c}${b}${gt}${br}<br>`;
    },

    gasketDescription() {
      if (!this.q) return '';
      if (this.descRows) return this.descRows[1] ? `${this.descRows[1]}<br>` : '';
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
      return `${c} ${f} ${s1} ${s2} ${m}<br>`;
    },

    kitDescription() {
      if (!this.q) return '';
      if (this.descRows) return this.descRows[2] ? `${this.descRows[2]}<br>` : '';
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
      return `${sleeve}${iso}${ret}${double}<br>`;
    },

    itemCustomizations() {
      if (!this.q) return '';
      if (!this.q.xx) return '';
      const customizationKeys = Object.keys(this.q.xx) || [];
      if (customizationKeys.length === 0) return '';
      const doNotShow = ['swSet', 'sleeveL', 'sleeveM', 'isoWasher', 'retWasher', 'dbl'];
      let xx = '>> <b>custom</b>';
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

    itemAdditions() {
      if (!this.fasteners) return '';
      if (this.fasteners.state !== 'S') return '';
      if (!this.fasteners.q) return '';
      const { pn: fPN, qty: fQty, q: fQ, p: fP } = this.fasteners;
      const { len, mat, nutMat } = fQ;
      const up = isNaN(fP.up) ? 'TBD' : fP.up;
      return `<b>ADD ${len.toFixed(2)}" long ${mat}</b> stud & <b>${nutMat}</b> 2 nuts for $ <b>${up}</b> x <b>${fQty}</b> / line pn <b>${fPN}</b>`;
    },

    torque() {
      if (this.trq) {
        const trq = this.trqData({ q: this.q, d: this.d, trq: this.trq });
        if (trq) {
          const { sug } = trq.trqR;
          const bolt = trq.trqV['Bolt Values'];
          const profile = trq.trqC === 'Kamm' ? ' for Any Flange' : ` for ${trq.trqC} Flange`;
          return `Sug-Trq: <b style="color:black">${Math.round(sug.torque.val)}</b> ${sug.torque.unit.replace(/ /g, '')} with k=<b>${bolt.k.val}</b>${profile}`;
        }
      }
      return '';
    },
  },

};
</script>

<style>
.pnTitle { font-size: 1.2em; color: #002B49; }

.desc { color: #777; font-size: 0.95em; }
.desc b { color: #111; font-weight: 500; }

.custom { color: red; }

.addition { color: #777 }
.addition b { color: #006298; font-weight: 500; }
</style>
