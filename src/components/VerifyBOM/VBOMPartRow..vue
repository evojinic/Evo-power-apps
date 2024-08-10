<template>
  <tr
    class="PartRow"
    :style="hasError"
  >
    <td @click="copyTD">
      {{ part.pn }}
    </td>
    <td
      :class="{'txt-err':hasDescriptionError}"
      @click="copyTD"
    >
      {{ part.desc }}
    </td>
    <td
      :class="{'txt-err':hasUMError}"
      @click="copyTD"
    >
      {{ part.um || '' }}
    </td>
    <td
      :class="{'txt-err':hasProductCodeError}"
      @click="copyTD"
    >
      {{ part.productCode || '' }}
    </td>
    <td
      :class="{'txt-err':hasPlannerCodeError}"
      @click="copyTD"
    >
      {{ part.planner || '' }}
    </td>
    <td
      :class="{'txt-err':hasFamilyCodeError}"
      @click="copyTD"
    >
      {{ part.family || '' }}
    </td>
    <td
      v-if="part.from"
      class="txt-err"
      @click="copyTD"
    >
      {{ part.from.join(', ') }}
    </td>
    <td v-else>
      -
    </td>
    <td
      v-if="part.exp"
      class="txt-err"
    >
      {{ part.exp.join(', ') }}
    </td>
    <td v-else>
      -
    </td>
  </tr>
</template>

<script>
import helpers from '@/_helpers/helpers';

export default {
  name: 'PartRow',
  mixins: [helpers],
  props: {
    part: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasError() {
      if (!this.part.exp) return '';
      if (this.part.exp.length === 0) return '';
      if (this.part.exp[0] === 'missing') return 'color: red; font-weight: bold';
      return 'color: black; font-weight: bold';
    },
    hasDescriptionError() {
      if (this.part.exp.indexOf('incorrect part') !== -1) return true;
      return false;
    },
    hasProductCodeError() {
      if (this.part.exp.indexOf('incorrect product code') !== -1) return true;
      return false;
    },
    hasPlannerCodeError() {
      if (this.part.exp.indexOf('incorrect planer code') !== -1) return true;
      return false;
    },
    hasFamilyCodeError() {
      if (this.part.exp.indexOf('incorrect family code') !== -1) return true;
      return false;
    },
    hasUMError() {
      if (this.part.exp.indexOf('incorrect unit of measure') !== -1) return true;
      return false;
    },
  },
  methods: {},
};
</script>

<style>
</style>
