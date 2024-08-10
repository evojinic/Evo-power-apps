<template>
  <div v-if="show && !hidden">
    <input type="checkbox"
      v-model="localVal"
      :id="oKey || fKey"
      :value="oKey || fKey"
      :disabled="disabled"
      :required="required"
    >
    <label :for="oKey || fKey">{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: 'DPill',
  emits: ['updateKey'],
  props: {
    value: {},
    oKey: { type: String },
    fKey: { type: String },
    label: { type: String },
    show: { default: false },
    hidden: { default: false },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    default: { default: '' },
  },

  computed: {
    localVal: {
      get() { return this.value; },
      set(localVal) { this.$emit('updateKey', { oKey: this.oKey, fKey: this.fKey, val: localVal }); },
    },
    items() {
      return this.list;
    },
  },
};
</script>

<style scoped>
input {
  display: none;
}
input + label {
  display: block;
  position: relative;
  width: 3em;
  height: 1.6em;
  margin-bottom: 20px;
  border-radius: 1em;
  background: #862633;
  box-shadow: inset 0px 0px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-transition: background 0.1s ease-in-out;
  transition: background 0.1s ease-in-out;
}
input + label:before {
  content: "";
  display: block;
  width: 1.2em;
  height: 1.2em;
  border-radius: 1em;
  background: #fff;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.2);
  position: absolute;
  left: 0.2em;
  top: 0.2em;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
input:checked + label {
  background: #002B49;
}
input:checked + label:before {
  box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.2);
  left: 1.6em;
}
</style>
