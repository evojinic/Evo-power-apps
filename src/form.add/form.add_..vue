<template>
  <v-form ref="form" v-model="valid" class="form-add">
    <!-- product selection -->
    <div style="text-align: center; width:99%;">
      <h2 style="padding-top: 12px">{{ formTitle }}</h2>
      <div v-if="allowLineMove">
        <v-btn small rounded color="gray" @click="moveIndex('up')" :disabled="editIndexArr[0] === 0">
          <v-icon left>arrow_upward</v-icon> Move Line Up
        </v-btn>
        <v-btn small rounded color="gray" @click="moveIndex('down')" :disabled="editIndexArr[0] >= parts.length - 1">
          <v-icon left>arrow_downward</v-icon> Move Line Down
        </v-btn>
      </div>
    </div>

    <div style="width:99%;">
      <DTC dropDown="product" />
    </div>

    <pasteAny v-if="product === 'pasteAny'" @setImportLines="setImportLines" />

    <DTC v-if="selected.dueDate" dropDown="job" />

    <DTC v-if="hasGasket || hasSwSet" dropDown="spec" />

    <DTC v-if="dropDown" :dropDown="dropDown" />
    <DTC v-if="showSwSet" dropDown="ik_swSet" />

    <DTC v-if="product !== 'pasteAny'" dropDown="line" />

    <dims />

    <div style="width:100%;">
      <contextNav
        :buttons="buttons"
        :fixed="true"
        :vertical="true"
        style="justify-content: center;"
        @pushToggle="toggleValue"
      />
    </div>
  </v-form>
</template>

<script>
import pasteAny from '@/form.add/form.pasteAny.vue';
import helpers from '@/_helpers/helpers';

import dims from '@/form.add/dims.vue';
import DTC from './DFCategories.vue';

export default {
  name: 'FormAdd',
  mixins: [helpers],
  components: {
    pasteAny,
    dims,
    DTC,
  },
  props: {
    parts: { type: Array, required: true },
    editIndexArr: { type: Array, required: true },
    formShowAlways: { type: Boolean, default: false },
  },
  data() {
    return {
      valid: false,
      advanceOptions: false,
      dims: {},
      // rawText: '',
      manualEntry: [],
    };
  },

  watch: {
    // rawText: {
    //   handler: 'parseManualEntry'
    // },
    editIndexArr(newVal) {
      const editParts = [];
      for (const i of newVal) {
        editParts.push({ ...this.parts[i], index: i });
      }
      this.$store.dispatch('dp/setEdit', { edits: newVal, editParts });
    },
    'selected.product'(n) {
      if (!n) this.$store.dispatch('dp/setSelectKey', { oKey: 'product', val: this.defaultProduct });
    },
  },

  created() {
    this.advanceOptions = this.defaultAdvanceOptions;
    this.$store.dispatch('dp/setSelectKey', { fKey: 'showADV', val: this.advanceOptions });
    this.$store.dispatch('dp/getSpecs');
    this.$store.dispatch('dp/getBores', { query: { } });
  },

  computed: {
    user() { return this.$store.getters['account/user'] || {}; },
    userDefaults() { return this.user.defaults || {}; },
    defaultProduct() { return this.userDefaults.product || 'ik_kit'; },
    defaultAdvanceOptions() { return this.userDefaults.advanceOptions || false; },
    //
    editCount() { return this.editIndexArr.length; },
    editLineString() {
      return this.editIndexArr.reduce((str, num) => `${str} | ${parseInt(num, 10) + 1}`, '');
    },
    buttonTitle() {
      if (this.editCount > 8) return `Update ${this.editCount} Lines`;
      return `Update Lines:${this.editLineString}`;
    },
    formTitle() {
      if (this.editLineString) return `Edit Lines ${this.editLineString}`;
      return 'Add Line to Estimate';
    },
    allowLineMove() {
      if (this.parts.length <= 1 || this.selected.job) return false;
      return this.editCount === 1;
    },
    //
    selected() { return this.$store.getters['dp/selected'] || {}; },
    disabled() { return this.$store.getters['dp/disable'] || {}; },
    product() { return this.selected.product; },
    hasSwSet() { return this.product === 'ik_kit' || this.product === 'ik_gasket' || this.product === 'ik_swSet'; },
    showSwSet() {
      if (this.product === 'ik_kit' && !this.selected.brand) return false;
      return this.hasSwSet;
    },
    hasGasket() { return this.product === 'ik_kit' || this.product === 'ik_gasket'; },
    showGasket() {
      if (this.hasGasket) {
        if (!this.selected.nSize) return false;
        if (!this.selected.pClass) return false;
        if (!this.selected.bore) return false;
      }
      return this.hasGasket;
    },
    showSideOfBolts() { return ['ik_gasket', 'ik_kit', 'ik_swSet'].indexOf(this.product) !== -1; },
    //
    dropDown() {
      // console.log('<<< load dropDown', this.product, this.selected.brand)
      if (this.product === 'modular') return this.product;
      if (this.product === 'gasket_soft') return this.product;
      if (this.product === 'gasket_kamm') return this.product;
      if (this.product === 'gasket_sw') return this.product;
      if (this.product === 'bolt') return this.product;
      if (this.product === 'nut') return this.product;
      if (this.product === 'husWasher') return this.product;
      if (this.product === 'custom') return this.product;
      if (this.product === 'charge') return this.product;
      if (this.product === 'isoTube') return this.product;
      if (this.product === 'isoSleeve') return this.product;
      if (this.product === 'isoWasher') return this.product;
      if (this.product === 'retWasher') return this.product;
      if (this.product === 'other') return this.product;
      if (this.showGasket) return 'gaskets';
      return '';
    },

    // context nav buttons
    buttons() {
      const buttons = [];

      if (this.editIndexArr.length >= 1) {
        if (!this.formShowAlways) {
          buttons.push({
            text: 'Close', action: 'close', icon: 'close', color: 'red',
          });
        }
        const icon = this.editIndexArr.length === 1 ? 'done' : 'done_all';
        buttons.push({
          text: this.buttonTitle, action: 'updateLine', icon, color: 'green',
        });
      }
      else {
        const addAction = this.product === 'pasteAny' ? 'addPasteAny' : 'addItem';
        buttons.push({
          text: 'Add to Quote',
          action: addAction,
          icon: 'done',
          disable: !this.valid,
          disableText: 'Not all fields selected',
        });

        if (!this.formShowAlways) {
          buttons.push({
            text: 'Close', action: 'close', icon: 'close', color: 'gray', small: true,
          });
        }
      }

      return buttons;
    },
  },

  methods: {
    // context nav handle
    toggleValue(value) {
      if (value === 'close') this.$emit('toggleValue', 'formShow');
      else if (value === 'updateLine') this.updateLine();
      else if (value === 'addPasteAny') this.addPasteAny();
      else if (value === 'addItem') this.getItem();
      else if (this[value] !== undefined) {
        // console.log(`${value} <-- toggled`);
        this[value] = !this[value];
      }
      // else console.log(`${value} <-- key does not exist`);
    },

    moveIndex(destination) { this.$emit('moveIndex', destination); },
    setImportLines(manualEntry) { this.manualEntry = manualEntry; },

    getItem(index) {
      const costObject = { ...this.selected };
      if (this.selected.xx) costObject.xx = { ...this.selected.xx };

      if (this.selected.spec === 'ENBRIDGE') {
        costObject.spec = 'ANSI B16.5';
        costObject.enbridge = true;
      }
      else if (costObject.enbridge) delete costObject.enbridge;

      if (this.selected.customBore) {
        costObject.bore = parseFloat(this.selected.customBore).toFixed(2);
        costObject.customBore = true;
      }

      // console.log(costObject)
      this.$refs.form.validate();
      if (this.valid) {
        const query = costObject;
        if (index >= 0) this.$emit('getItem', query, index, this.selected.qty);
        else if (this.selected.nSize && this.selected.nSize.length > 0) {
          const multipleSizes = Array.isArray(this.selected.nSize) ? this.selected.nSize : [this.selected.nSize];
          for (const size of multipleSizes) {
            query.nSize = size;
            this.$emit('getItem', query, undefined, this.selected.qty);
          }
          // clear size
          if (this.selected.nSize.length > 1) this.$store.dispatch('dp/setSelectKey', { oKey: 'nSize', val: [] });
        }
        else {
          this.$emit('getItem', query, undefined, this.selected.qty);
        }
        this.$emit('clearIndexEdit');
      }
    },

    updateLine() {
      // if there are multiple manualEntry disable options
      if (this.manualEntry.length > 0) {
        for (const index in this.manualEntry) {
          if ({}.hasOwnProperty.call(this.manualEntry, index)) {
            const line = this.manualEntry[index];
            // console.log('manual entry update', line);
            this.$emit('getItem', line.pn, line.ln - 1, line.qty);
          }
        }
      }
      else if (this.editIndexArr.length > 1) {
        const selectedKeys = Object.keys(this.selected);
        // update query for each selected item
        const editIndexes = this.editIndexArr.slice(0);
        for (const index of editIndexes) {
          // console.log('update: ', index, this.parts[index].pn);
          if (index >= 0) {
            // cache item query
            const changes = [];
            const query = this.parts[index].q;
            // check if sleeve length is custom; when brand changes the sleeve length could change as well
            const itemD = this.parts[index].d;
            if (itemD && itemD.sleeve && itemD.sleeve.stdLength === query.sleeveL) delete query.sleeveL;
            if (this.selected.dueDate) query.dueDate = this.parts[index].dueDate;
            // for every gey that is the same and not disabled
            for (const key of selectedKeys) {
              if (key === 'sleeveL') continue;
              if (!query[key]) continue;
              if (this.disabled[key]) continue;
              if (query[key] === this.selected[key]) continue;
              // change value
              // console.log({ from: query[key], to: this.selected[key] }, key);
              query[key] = this.selected[key];
              changes.push(key);
            }
            // console.log(query);
            // console.log(changes);

            if (changes.length === 1 && changes[0] === 'dueDate') {
              this.$emit('setDueDate', query, index);
            }
            else if (changes.length > 0) {
              this.$emit('getItem', query, index);
            }
          }
        }
      }
      else {
        const index = this.editIndexArr[0];
        this.getItem(index);
      }
      this.$emit('clearIndexEdit');
    },

    addPasteAny() {
      for (const index in this.manualEntry) {
        if ({}.hasOwnProperty.call(this.manualEntry, index)) {
          const line = this.manualEntry[index];
          this.$emit('getItem', line.pn, undefined, line.qty);
        }
      }
      this.manualEntry = [];
    },
  },
};
</script>

<style>
.form-add {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  /* justify-content: center; */
  /* display: grid; */
  /* grid-auto-flow: row; */
  align-content: flex-start;
}
</style>
