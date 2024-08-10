<template>
  <!-- <div class="context-nav-btn" v-on:mouseover="hide=true" v-on:mouseout="hide=false"> -->
  <div class="context-nav-btn">
    <p class="helpText">{{ text }}</p>
    <v-btn v-if="button.to"
      fab
      dark
      :small="small"
      :disabled="disabled"
      :class="color"
      :to="button.to"
    >
      <v-icon dark>{{ button.icon }}</v-icon>
    </v-btn>
    <v-btn v-else-if="button.action"
      fab
      dark
      :small="small"
      :disabled="disabled"
      :class="color"
      @click="push"
    >
      <v-icon dark>{{ button.icon }}</v-icon>
    </v-btn>
    <v-btn v-else
      fab
      dark
      :small="small"
      :disabled="disabled"
      :class="color"
    >
      <v-icon dark>{{ button.icon }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    button: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      helpText: false,
    };
  },

  computed: {
    disabled() {
      // if (this.button.disable) return true;
      return false;
    },
    text() {
      if (this.button.disable) return this.button.disableText;
      return this.button.text;
    },
    color() {
      if (this.button.disable) return this.button.disableColor || 'grey';
      return this.button.color || 'primary';
    },
    small() {
      if (this.button.icon === 'delete') return true;
      if (this.button.small) return true;
      return false;
    },
  },

  methods: {
    push() {
      // console.log('btn '+ this.button.icon +' pushed '+ this.button.action);
      this.$emit('push', this.button.action);
    },
  },
};
</script>

<style>
.context-nav-btn {
  margin: 5px;
}

.helpText {
  position: relative;
  margin-right: -27px;
  padding: 7px 27px 7px 7px;
  top: 0px;
  font-size: 12px;
  display: inline;
  border-radius: 7px;
  color: #000;
  background: #D6D2C4;
  vertical-align: middle;
}

@media only screen and (max-width: 800px) {
  .helpText {
    display: none;
  }
}
</style>
