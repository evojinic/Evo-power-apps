<template>
  <tr
    class="MaterialRow"
    :style="hasError"
  >
    <td @click="copyTD">
      {{ material.pn }}
    </td>
    <td @click="copyTD">
      {{ material.op }}
    </td>
    <td @click="copyTD">
      {{ material.wc }}
    </td>
    <td @click="copyTD">
      {{ material.sq }}
    </td>
    <td
      :class="{'txt-err':hasMatError}"
      @click="copyTD"
    >
      {{ material.mat }}
    </td>
    <td
      :class="{'txt-err':hasQtyError}"
      @click="copyTD"
    >
      {{ material.qty }}
    </td>
    <td
      :class="{'txt-err':hasScrapError}"
      @click="copyTD"
    >
      {{ material.sf }}
    </td>
    <td
      :class="{'txt-err':hasUMError}"
      @click="copyTD"
    >
      {{ material.um }}
    </td>
    <td
      v-if="material.from"
      class="txt-err"
      @click="copyTD"
    >
      {{ material.from.join(', ') }}
    </td>
    <td v-else>
      -
    </td>
    <td
      v-if="material.exp"
      class="txt-err"
    >
      {{ material.exp.join(', ') }}
    </td>
    <td v-else>
      -
    </td>
  </tr>
</template>

<script>
import helpers from '@/_helpers/helpers';

export default {
  name: 'MaterialRow',
  mixins: [helpers],
  props: {
    material: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasError() {
      if (!this.material.exp) return '';
      if (this.material.exp.length === 0) return '';
      if (this.material.exp[0] === 'missing') return 'color: red; font-weight: bold';
      return 'color: black; font-weight: bold';
    },
    hasMatError() {
      if (this.material.exp.indexOf('incorrect material') !== -1) return true;
      return false;
    },
    hasQtyError() {
      if (this.material.exp.indexOf('incorrect qty') !== -1) return true;
      return false;
    },
    hasScrapError() {
      if (this.material.exp.indexOf('incorrect scrap factor') !== -1) return true;
      return false;
    },
    hasUMError() {
      if (this.material.exp.indexOf('incorrect unit of measure') !== -1) return true;
      return false;
    },
  },
  methods: {},
};
</script>

<style>
</style>
