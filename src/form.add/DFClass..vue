<template>
  <div v-if="show && !hidden">
    <v-select
      v-model="localVal"
      :label="label"
      :items="items"
      :multiple="multiple"
      :disabled="disabled"
      :required="required"
      :class="{ 'text-notice': !localVal && required }"
      :rules="[required ? (v) => !!v || 'Can not be blank to continue!' : false]"
      :placeholder="'none'"
      dense
    ></v-select>
  </div>
</template>

<script>
import helpers from '@/_helpers/helpers';

export default {
  name: 'DSelect',
  mixins: [helpers],
  emits: ['updateKey'],
  props: {
    value: {},
    oKey: { type: String },
    fKey: { type: String },
    label: { type: String, required: true },
    show: { default: false },
    hidden: { default: false },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    useTextValue: { type: String, default: '' },
    default: { },
    // items: { default() { return []; } },
  },

  computed: {
    localVal: {
      get() {
        if (this.multiple) {
          if (Array.isArray(this.value)) return this.value;
          return [this.value];
        }
        if (!this.multiple && Array.isArray(this.value)) return this.value[0];
        return this.value;
      },
      set(localVal) {
        this.$emit('updateKey', { oKey: this.oKey, fKey: this.fKey, val: localVal });
      },
    },
    specs() { return this.$store.getters['dp/specs']; },
    selected() { return this.$store.getters['dp/selected']; },
    filters() { return this.$store.getters['dp/filters']; },
    // filterList: { list: 'specs', sfKey: 'size',
    // sort: { type: 'number' }, fKeys: [{ fKey: 'spec' }, { fKey: 'pClass' }] },
    filterList() {
      const { spec, size } = this.filters;
      return this.specs.filter(li => {
        if (li.spec !== spec) return false;
        if (li.size !== size) return false;
        return true;
      });
      // .map(mapFun).filter((li, i, arr) => arr.indexOf(li) === i);
    },
    items() {
      return this.filterList.map(i => ({
        value: i.pClass,
        text: i.pClass,
        sort: parseFloat(i.pClass.toString().replace(/[T|PN]/, '')),
      })).sort((a, b) => a.sort - b.sort);
    },
    // items() {
    //   const customBore = { value: 'User Defined', text: 'User Defined' };
    //   let bores = [];
    //   if (this.filteredBores.length < 2) {
    //     bores.unshift(customBore);
    //     return bores;
    //   }
    //   if (this.selected.nSize.length > 1) {
    //     bores = this.filteredBores
    //       .map(b => ({ value: b.bore, text: `${b.bore}` }));
    //   }
    //   else {
    //     bores = this.filteredBores
    //       .map(b => ({ value: b.bore, text: `${b.flangeID.toFixed(3)}" (${(b.flangeID * 25.4).toFixed(1)}mm) :: ${b.bore}`, ...b }))
    //       .sort((a, b) => Number(a.flangeID) - Number(b.flangeID));
    //   }
    //   bores.unshift(customBore);
    //   return bores;
    // }
  },
};
</script>

<style>
</style>
