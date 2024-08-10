<template>
  <div style="max-width: 300px">
    <DRadio v-bind="sideOfBolts" :value="boltsOnSide" @updateKey="updateKey" />
  </div>
</template>

<script>
import DRadio from '@/form.add/form.add.any_radio.vue';

export default {
  name: 'SideOfBoltsToggle',
  components: { DRadio },
  props: {
    items: { type: Array, default() { return []; } },
  },
  data() {
    return {
    };
  },

  computed: {
    boltsOnSide() { return this.$store.getters['quote/boltsOnSide']; },
    sideOfBolts() {
      return {
        oKey: 'boltsOnSide',
        category: 'side',
        label: 'Bolts On the Side',
        type: 'radio',
        default: 'S',
        items: [
          { value: 'N', code: '', text: 'None' },
          { value: 'S', code: '', text: 'Suggestion' },
          { value: 'I', code: '', text: 'Included' },
        ],
      };
    },
    showSideOfBolts() {
      for (const i of this.items) {
        if (i && i.q && ['ik_gasket', 'ik_kit', 'ik_swSet', 'gasket_kamm', 'gasket_sw'].indexOf(i.q.product) !== -1) return true;
      }
      return false;
    },
  },

  methods: {
    updateKey({ oKey, val }) {
      if (oKey === 'boltsOnSide') this.$store.dispatch('quote/updateQD', { oKey, val });
    },
  },
};
</script>

<style scoped>
</style>
