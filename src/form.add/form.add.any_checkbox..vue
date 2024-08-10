<template>
  <div v-if="show" class="dpCheck">
    <input type="checkbox"
      v-model="localVal"
      :id="refKey"
      :value="refKey"
      :disabled="disabled"
      :required="required"
    >
    <label :for="refKey">{{ label }} <span v-if="required" style="color: red">*</span></label>
  </div>
</template>

<script>
export default {
  name: 'DCheckBox',
  emits: ['updateKey'],
  props: {
    value: {},
    oKey: { type: String },
    fKey: { type: String },
    label: { type: String },
    show: { default: false },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    default: { type: Boolean },
    xx: { type: Boolean, default: false },
  },

  computed: {
    refKey() { return this.oKey || this.fKey; },
    localVal: {
      get() { return this.value; },
      set(localVal) { this.$emit('updateKey', { oKey: this.oKey, fKey: this.fKey, val: localVal }); },
    },
  },
};
</script>

<style scoped>
.dpCheck {
  padding-left: 1em;
}
input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
input + label {
  display: block;
  position: relative;
  padding-left: 1.2em;
  /* margin-bottom: 20px; */
  font-size: 1.1em;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
input + label:last-child {
  margin-bottom: 0.2em;
}
input + label:before {
  content: "";
  display: block;
  width: 0.7em;
  height: 0.7em;
  border: 1px solid #343a3f;
  border-radius: 0.2em;
  position: absolute;
  left: 0em;
  top: 0.35em;
  -webkit-transition: all 0.2s, background 0.2s ease-in-out;
  transition: all 0.2s, background 0.2s ease-in-out;
  /* background: #f3f3f3; */
  border: 2px solid #fff;
  border-radius: 0.2em;
  box-shadow: 0 0 0 1px #002B49;
}
input:checked + label:before {
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  background: #862633;
  box-shadow: 0 0 0 3px #002B49;
}
input:checked + label {
  color: #002B49; font-weight: bold;
}

/* hover */
input:hover + label:hover {
  color: #862633; font-weight: bold;
}
input:hover + label:before {
  background: #002B49;
  box-shadow: 0 0 0 2px #862633;
}
/* focus */
input:focus + label {
  color: #862633; font-weight: bold;
}
input:focus + label:before {
  /* background: #002B49; */
  box-shadow: 0 0 0 4px #862633;
}
/* disabled */
input:disabled + label:before {
  box-shadow: 0 0 0 1px #aaa;
}
input:checked:disabled + label:before {
  background: #862633;
}

input:disabled + label {
  color: rgba(0,0,0,0.6) !important; font-weight: unset !important;
}
</style>
