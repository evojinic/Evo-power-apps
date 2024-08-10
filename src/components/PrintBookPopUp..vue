<template>
  <transition name="fast-fade">
    <div v-if="show" id="pop-up" @click.self="close">
      <contextNav class="pop-up-nav" :buttons="buttons" @pushToggle="toggleValue" />
      <QCopyPaste v-if="includeCopyPaste" :quote="quote" :user="user" />
      <verifyBOM v-if="includeBOM" :user="user" />
      <verifyMaterial v-if="includeINV" :user="user" />
    </div>
  </transition>
</template>

<script>
import QCopyPaste from '@/pages/Quotes/QCopyPaste.vue';
import verifyBOM from '@/components/VerifyBOM/VBOMList.vue';
import verifyMaterial from '@/components/VerifyMaterial/VMaterialList.vue';
import helpers from '@/_helpers/helpers';

export default {
  components: {
    QCopyPaste,
    verifyBOM,
    verifyMaterial,
  },

  mixins: [helpers],

  props: {
    show: { type: Boolean, default: true },
    settings: { type: Object, required: true },
    quote: { type: Object, required: true },
  },

  data() { return { }; },

  computed: {
    user() { return this.$store.getters['account/user']; },
    buttons() {
      const buttons = [];
      buttons.push({ text: 'close', icon: 'close', color: 'gray', action: 'close' });
      if (this.includeCopyPaste) return buttons;
      return buttons;
    },
    includeCopyPaste() { return this.settings.include.indexOf('copyPaste') !== -1; },
    includeBOM() { return this.settings.include.indexOf('BOM') !== -1; },
    includeINV() { return this.settings.include.indexOf('verifyMaterial') !== -1; },
  },

  methods: {
    toggleValue(value) {
      if (value === 'close') {
        this.close();
      }
      else if (this[value] !== undefined) {
        // console.log(`${value} <-- toggled`);
        this[value] = !this[value];
      }
      else {
        // console.log(` toggle value ${value}`);
      }
    },

    close() {
      this.$emit('toggleValue', 'viewBook');
    },
  },
};
</script>

<style scoped>
#pop-up {
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 30;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 84px 0 0 0;
  background-color: rgba(0, 0, 0, 0.7);
  /* font: 9pt "Aerial"; */
  font-size: 9pt;
  overflow: auto;
}

.pop-up-nav {
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 99;
}

@media only screen and (max-width: 800px) {
  #pop-up {
    padding: 0px;
  }
  .pop-up-nav {
    top: auto;
    bottom: 4px;
    right: 4px;
    width: 4px;
    height: 4px;
    z-index: 99;
  }
}
</style>
