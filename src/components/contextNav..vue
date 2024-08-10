<template>
  <div
    class="contextNav"
    :class="{contextNavVertical: vertical, bottomRight: fixed, alignRight: right}"
  >
    <contextNavBtn
      v-for="(button, id) in buttons"
      :key="id"
      :button="button"
      @push="pushPass"
    />
  </div>
</template>

<script>
import contextNavBtn from '@/components/contextNavBtn.vue';

export default {

  name: 'ContextNav',

  components: {
    contextNavBtn,
  },

  props: {
    right: {
      type: Boolean,
    },
    fixed: {
      type: Boolean,
    },
    vertical: {
      type: Boolean,
    },
    buttons: {
      type: Array,
      required: true,
    },
  },

  methods: {
    pushPass(action) {
      // console.log('pass push '+ action);
      this.$emit('pushToggle', action);
    },
  },

};
</script>

<style>
.contextNav {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.contextNavVertical {
  flex-direction: column-reverse;
  align-items: flex-end;
}
.alignRight {
  justify-content: flex-end;
}
.bottomRight {
  position: fixed;
  right: 5px;
  bottom: 5px;
  z-index: 9;
}
@media only screen and (max-width: 800px) {
  .contextNav {
    flex-direction: column-reverse;
    align-items: flex-end;
    position: fixed;
    right: 5px;
    bottom: 5px;
    z-index: 9;
    text-align: right;
  }
}
</style>
