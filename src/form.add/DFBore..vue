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
export default {
  name: 'DSelect',
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
        return this.value;
      },
      set(localVal) {
        this.$emit('updateKey', { oKey: this.oKey, fKey: this.fKey, val: localVal });
      },
    },
    selected() { return this.$store.getters['dp/selected']; },
    filters() { return this.$store.getters['dp/filters']; },
    // specs() { return this.$store.getters['dp/specs']; },
    bores() { return this.$store.getters['dp/bores']; },
    filteredBores() {
      const { nSize } = this.selected;
      const { spec, size, pClass } = this.filters;
      if (!nSize) return [];
      if (spec === 'BS EN 1092-1:2007') return [{ value: 'BS', text: 'BS' }];
      if (spec === 'SEMPRA' && pClass <= 300) return [{ value: 'SM', text: 'SM' }];
      if (spec === 'SEVAL') return [{ value: 'SV', text: 'SV' }];
      if (spec === 'AWWA') return [{ value: pClass, text: pClass }];
      if (spec === 'API') return [{ value: 'API', text: 'API' }];
      if (spec === 'JIS') return [{ value: 'JIS', text: 'JIS' }];

      const noLetter = size.replace(/(A|B)/, '');
      return this.bores.filter(b => {
        if (b.spec !== spec) return false;
        if (b.size !== noLetter) return false;
        return true;
      }) || [];
    },
    items() {
      const customBore = { value: 'User Defined', text: 'User Defined' };
      let bores = [];
      if (this.filteredBores.length < 2) {
        bores = this.filteredBores;
      }
      else if (Array.isArray(this.selected.nSize) && this.selected.nSize.length > 1) {
        bores = this.filteredBores
          .map(b => ({ value: b.bore, text: `${b.bore}` }));
      }
      else {
        bores = this.filteredBores
          .map(b => ({ value: b.bore, text: `${b.flangeID.toFixed(3)}" (${(b.flangeID * 25.4).toFixed(1)}mm) :: ${b.bore}`, ...b }))
          .sort((a, b) => Number(a.flangeID) - Number(b.flangeID));
      }
      bores.unshift(customBore);
      return bores;
    },
  },
};
</script>

<style scoped>
</style>
