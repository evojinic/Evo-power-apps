<template>
  <tr
    class="OperationRow"
    :style="hasError"
  >
    <td @click="copyTD">
      {{ op.pn }}
    </td>
    <td @click="copyTD">
      {{ op.op }}
    </td>
    <td @click="copyTD">
      {{ op.wc }}
    </td>
    <td
      :class="{'txt-err':hasPpMhError}"
      @click="copyTD"
    >
      {{ op._mh }}
    </td>
    <!-- <td @click="copyTD" :class="{'txt-err':hasPpMhError}">{{ op._lh }}</td> -->
    <td
      @click="copyTD"
      v-html="wcNotes"
    />
    <!-- <td @click="copyTD">{{ op._lh }}</td> -->
    <!-- <td @click="copyTD">{{ op._sh }}</td> -->
    <!-- <td @click="copyTD">{{ op._qh }}</td> -->
    <!-- <td @click="copyTD">{{ op._vh }}</td> -->
    <td
      v-if="op.from"
      class="txt-err"
      @click="copyTD"
    >
      {{ op.from.join(', ') }}
    </td>
    <td v-else>
      -
    </td>
    <td
      v-if="op.exp"
      class="txt-err"
    >
      {{ op.exp.join(', ') }}
    </td>
    <td v-else>
      -
    </td>
  </tr>
</template>

<script>
import helpers from '@/_helpers/helpers';

export default {
  name: 'OperationRow',
  mixins: [helpers],
  props: {
    op: {
      type: Object,
      required: true,
    },
  },
  computed: {
    wcNotes() {
      if (!this.op.wn) return '';
      return this.op.wn.replace(/\n/g, '<br>');
    },
    hasError() {
      if (!this.op.exp) return '';
      if (this.op.exp.length === 0) return '';
      if (this.op.exp[0] === 'missing') return 'color: red; font-weight: bold';
      return 'color: black; font-weight: bold';
    },
    hasPpMhError() {
      if (this.op.exp.indexOf('incorrect PPMH') !== -1) return true;
      return false;
    },
  },
  methods: {},
};
</script>

<style>
</style>
