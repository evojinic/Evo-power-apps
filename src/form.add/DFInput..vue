<template>
  <div class="gaInput">
    <DCheckbox v-if="xxKey && xxToggle.show" v-bind="xxToggle" @updateKey="toggleXX" />
    <!-- {{ gaInput.oKey }} - {{ gaInput.label }} :: {{ show }} -->
    <component v-show="show" :is="comp" v-bind="option" @updateKey="updateKey" />
  </div>
</template>

<script>
import DSelect from './form.add.any_select.vue';
import DRadio from './form.add.any_radio.vue';
import DText from './form.add.any_text.vue';
import DTextarea from './form.add.any_textarea.vue';
import DCheckbox from './form.add.any_checkbox.vue';
import DPill from './form.add.any_pill.vue';
import DFBore from './DFBore.vue';
import DFSize from './DFSize.vue';
import DFClass from './DFClass.vue';

export default {
  name: 'gaInput',
  components: {
    DSelect, DRadio, DText, DTextarea, DCheckbox, DPill, DFBore, DFSize, DFClass,
  },
  props: {
    gaInput: { type: Object },
  },

  destroyed() {
    const { oKey, xxKey, fKey, default: dv } = this.gaInput;
    this.$store.dispatch('dp/rmvKey', { oKey, fKey, xxKey, default: dv });
  },
  mounted() {
    const { oKey, xxKey, fKey, default: dv } = this.gaInput;
    this.$store.dispatch('dp/addKey', { oKey, fKey, xxKey, default: dv });
  },

  watch: {
    itemLen: {
      handler: 'validateList',
      immediate: true,
    },
  },

  computed: {
    shouldValidate() { return true; },
    hasError() { return true; },
    comp() {
      if (this.gaInput.type === 'bore') return 'DFBore';
      if (this.gaInput.type === 'nSize') return 'DFSize';
      if (this.gaInput.type === 'pClass') return 'DFClass';
      if (this.gaInput.type === 'checkbox') return 'DCheckbox';
      if (this.gaInput.type === 'textarea') return 'DTextarea';
      if (this.gaInput.type === 'select' && this.itemLen < 3) return 'DRadio';
      if (this.gaInput.type === 'select') return 'DSelect';
      if (this.gaInput.type === 'switch') return 'DPill';
      if (this.gaInput.type === 'radio') return 'DRadio';
      return 'DText';
    },
    selected() { return this.$store.getters['dp/selected']; },
    disable() { return this.$store.getters['dp/disable']; },
    visible() { return this.$store.getters['dp/visible']; },
    filters() { return this.$store.getters['dp/filters']; },
    showADV() { return this.filters.showADV; },
    specs() { return this.$store.getters['dp/specs']; },
    bores() { return this.$store.getters['dp/bores']; },
    // oKey() { return this.gaInput.oKey; },
    xxKey() { return this.gaInput.xxKey || false; },
    conditionCheck() {
      if (!this.gaInput.conditions) return true;
      // console.log(`%c??? ${[this.gaInput.oKey,  this.gaInput.fKey, this.gaInput.xxKey]}`, 'color: yellow');
      for (const { oKey, fKey, xxKey, val, $in } of this.gaInput.conditions) {
        const cVal = this.selected[oKey] || this.filters[fKey] || this.selected.xx[xxKey];
        // console.log({ oKey, fKey, xxKey, cVal })
        if (val === false) {
          if (cVal) return false;
          continue;
        }
        if (!cVal) return false;
        if ($in) {
          if ($in.indexOf(cVal) === -1) return false;
          continue;
        }
        if (val) {
          if (val !== cVal) return false;
          continue;
        }
      }
      // console.log('^^^ show ^^^')
      // console.log(`%cshow ${[this.gaInput.oKey,  this.gaInput.fKey, this.gaInput.xxKey]}`, 'color: yellow');
      return true;
    },
    xxToggle() {
      return {
        value: typeof this.selected.xx[this.xxKey] !== 'undefined',
        oKey: this.gaInput.xxKey,
        label: `:: ${this.gaInput.label}`,
        hidden: this.filters.editLen > 1,
        show: this.selected.xx[this.xxKey] !== undefined || this.showADV && this.conditionCheck,
        xxKey: this.gaInput.xxKey,
        xx: true,
      };
    },
    show() {
      if (this.xxKey && typeof this.selected.xx[this.xxKey] === 'undefined') return false;
      return this.conditionCheck;
    },
    // filterList() {
    //   const filter = this.gaInput.filterList;
    //   // console.log('------')
    //   // console.log('------')
    //   // console.log({ ...this.filters })
    //   if (!filter) return [];
    //   const { list, sfKey, sort, fKeys } = filter;
    //   if (list === 'bores') return this.filteredBores;
    //   let refList = [];
    //   let mapFun = i => i[sfKey];
    //   if (list === 'specs') refList = this.specs;
    //   const uniqueList = refList.filter(li  => {
    //     for (const { fKey } of fKeys) {
    //       const lVal = li[fKey];
    //       const fVal = this.filters[fKey];
    //       // if (fVal && fVal !== lVal) return false;
    //       const testString = Array.isArray(fVal) ? fVal.join('|') : fVal;
    //       const regTest = new RegExp(`^(${testString})$`);
    //       // console.log(lVal, fVal, regTest, regTest.test(lVal))
    //       if (fVal && !regTest.test(lVal)) return false;
    //     }
    //     return true;
    //   }).map(mapFun).filter((li, i, arr) => arr.indexOf(li) === i);
    //   // console.log(uniqueList)
    //   // console.log('------')
    //   if (sort) {
    //     if (sort.type === 'number') return uniqueList.sort((a, b) => Number(a) - Number(b));
    //   }
    //   return uniqueList;
    //   // filter: { list: 'specs', fKey: 'size', fKeys: [{ fKey: 'spec' }, { fKey: 'pClass' }] },
    // },
    items() {
      const { filterKeys, list = [] } = this.gaInput;
      // if (filterList) return this.filterList;
      if (!filterKeys) {
        return list.filter(li => {
          if (li.hidden) return false;
          return true;
        });
      }
      // console.log(this.gaInput)
      // console.log(this.gaInput.oKey)
      return list.filter(li => {
        if (li.hidden) return false;
        for (const { fKey, $lt, $gt, $in, fReq, lReq, oKey, oVal } of filterKeys) {
          const cVal = this.filters[oKey] || this.selected[oKey];
          const fVal = this.filters[fKey];
          const lVal = lReq && !li[fKey] ? '' : li[fKey];
          // console.log({ fKey, fVal, lVal });
          // skip if option key required does not match
          if (oKey && cVal !== oVal) continue;
          if (fVal === lVal) continue;
          if (!fVal && fReq) continue;
          if (!lVal && fVal === 'ANY') continue;
          // console.log({ oK: oKey, c: cVal, o: oVal });
          if (!lVal && lReq) return false;
          if (lVal !== fVal) {
            if ($gt) {
              if (fVal > lVal) return false;
              continue;
            }
            if ($lt) {
              if (lVal < fVal) return false;
              continue;
            }
            if ($in) {
              if (lVal.indexOf(fVal) === -1) return false;
              continue;
            }
            return false;
          }
        }
        // console.log('^^^ pass ^^^')
        return true;
      });
    },
    itemLen() { return this.items.length; },
    multiple() {
      if (!this.gaInput.multipleIf) return false;
      // console.log('show?', this.gaInput.oKey, this.gaInput.xxKey)
      for (const { fKey, oKey, xxKey, value: val, $in } of this.gaInput.multipleIf) {
        const cVal = this.filters[fKey] || this.filters[oKey] || this.selected.xx[xxKey];
        // console.log({ oKey, xxKey, cVal })
        if (!cVal) return false;
        if ($in) {
          if ($in.indexOf(cVal) === -1) return false;
          continue;
        }
        if (val) {
          if (val !== cVal) return false;
          continue;
        }
        // console.log('^^^ show ^^^')
      }
      return true;
    },
    option() {
      const { oKey, xxKey, fKey, disabled } = this.gaInput;
      const oVal = this.selected.xx[xxKey] || this.selected[oKey] || this.filters[fKey];
      return {
        ...this.gaInput,
        value: !this.show ? '' : oVal,
        oKey: oKey || xxKey,
        fKey,
        show: this.show,
        items: this.items,
        disabled: disabled || this.disable[oKey] || this.disable[fKey] || this.filters.editLen > 1 && xxKey !== undefined,
        // placeholder: this.gaInput.default
        multiple: this.multiple,
      };
    },
  },

  methods: {
    updateKey({ oKey: uKey, val }) {
      const { oKey, xxKey, fKey, fVal: ofVal, list, overwrite: ov } = this.gaInput;
      const li = list ? list.find(i => i.value === val) : null;
      const overwrite = li ? li.overwrite : ov;
      const fVal = li ? li.fVal : ofVal;
      this.$store.dispatch('dp/setSelectKey', { val, oKey: uKey || oKey, xxKey, fVal, fKey, overwrite });
      // if (this.gaInput.required && !val) this.$emit('valid', { refKey: oKey || xxKey || fKey, field: this.gaInput.label, valid: false });
      // if (!this.gaInput.required || val) this.$emit('valid', { refKey: oKey || xxKey || fKey, field: this.gaInput.label, valid: true });
    },
    toggleXX({ oKey: uKey, val }) {
      const { oKey, xxKey, fKey, default: dv } = this.gaInput;
      // console.log('ga-input-xx', { uKey, xxKey, oKey, val }, this.showXX)
      this.$store.dispatch('dp/setSelectKey', { oKey: uKey || oKey, toggle: val, xxKey, fKey, default: dv });
    },
    validateList() {
      const { oKey, list } = this.gaInput;
      if (!list) return;
      const oVal = this.selected[oKey];
      if (oKey && oKey !== 'nSize' && oKey !== 'pClass' && oKey !== 'dims') {
        // console.log('%c!!! validateList', 'color: blue');
        // console.log(oKey, this.itemLen, oVal)
        // only one in the list
        if (this.itemLen === 1) {
          const lOpt = this.items[0];
          const val = lOpt.value || lOpt;
          if (oKey === 'dims') this.$store.dispatch('dp/setSelectKey', { oKey, val });
          else if (oVal !== val) {
            // console.log('since only one', oKey, oVal, val)
            this.$store.dispatch('dp/setSelectKey', { oKey, val });
          }
        }
        // list is empty
        else if (this.itemLen === 0 && oVal !== '') {
          // console.log('list is empty', oKey, oVal)
          this.$store.dispatch('dp/setSelectKey', { oKey, val: '' });
        }
        // chosen value not in the list
        else if (!this.items.find(li => li.value === oVal)) {
          // console.log('not in the list', oKey, oVal)
          this.$store.dispatch('dp/setSelectKey', { oKey, val: '' });
        }
      }
    },
  },
};
</script>

<style>
</style>
