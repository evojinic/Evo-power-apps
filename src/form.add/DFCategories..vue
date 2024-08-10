<template>
  <div v-if="isLoading" class="f-card">
    <ga-spinner />
  </div>
  <div v-else>
    <div class="f-card" v-for="category of categories" :key="category.value">
      <div v-if="category.label" class="f-card-title">{{ category.label.toUpperCase() }}</div>
      <DFInput v-for="option of optionListFor(category.value)" :gaInput="option" :key="option.oKey" />
    </div>
  </div>
</template>

<script>
import DFInput from './DFInput.vue';

export default {
  name: 'FormDropDown',
  components: { DFInput },
  props: {
    dropDown: { type: String, default: '' },
    advanceOptions: { type: Boolean, default: false },
  },

  data() {
    return {
      collapsed: false,
    };
  },

  watch: {
    dropDown: {
      handler: 'setDropDown',
      immediate: true,
    },
  },

  // create() { if (this.options.length > 0) this.$store.dispatch('dp/addDp', this.options); },
  // destroyed() { if (this.options.length > 0) this.$store.dispatch('dp/rmvDp', this.dropDown); },

  computed: {
    dp() { return this.$store.getters['dp/dpList'][this.dropDown] || { categories: [], options: [] }; },
    options() { return this.dp.options; },
    isLoading() { return this.$store.getters['dp/status'][this.dropDown] || false; },
    // disable() { return this.$store.getters['dp/disable']; },
    selected() { return this.$store.getters['dp/selected']; },
    filters() { return this.$store.getters['dp/filters']; },
    categories() {
      return this.dp.categories.filter(category => {
        if (!category.conditions) return true;
        // console.log('show?', category.oKey, category.xxKey)
        for (const { oKey, fKey, xxKey, val, $in } of category.conditions) {
          const cVal = this.selected[oKey] || this.filters[fKey] || this.selected.xx[xxKey];
          // console.log({ oKey, xxKey, cVal })
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
          // console.log('^^^ show ^^^')
        }
        return true;
      });
    },
  },

  methods: {
    setDropDown(nV, oV) {
      if (oV !== nV && this.dropDown) {
        this.$store.dispatch('dp/getOptions', this.dropDown);
      }
    },
    optionListFor(category) {
      if (!category) return this.options;
      return this.options.filter(o => o.category === category);
    },
  },
};
</script>

<style>
</style>
