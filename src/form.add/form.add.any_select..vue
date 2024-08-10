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
    def: { },
    items: { default() { return []; } },
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
        if (this.useTextValue && !this.multiple) {
          const so = this.items.find(o => o.value === localVal);
          this.$emit('updateKey', { oKey: this.useTextValue, val: so.text });
        }
      },
    },
  },
};
</script>

<style scoped>
</style>
