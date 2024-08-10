<template>
  <div v-if="show && !hidden">
    <v-textarea
      v-model="localVal"
      :disabled="disabled"
      :label="label"
      :rows="rows"
      dense
      :required="required"
      :class="{ 'text-notice': !localVal && required }"
      :rules="[required ? (v) => !!v || 'Can not be blank to continue!' : false]"
    />
  </div>
</template>

<script>
export default {
  name: 'DTextarea',
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
    default: { default: '' },
    rows: { type: Number, default: 3 },
  },

  computed: {
    localVal: {
      get() { return this.value; },
      set(localVal) { this.$emit('updateKey', { oKey: this.oKey, fKey: this.fKey, val: localVal }); },
    },
  },
};
</script>

<style scoped>
</style>
