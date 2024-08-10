<template>
  <table>
    <tr>
      <th>Part Num</th>
      <th>OP</th>
      <th>WC</th>
      <th>Seq</th>
      <th>Mat</th>
      <th>Qty</th>
      <th>SF</th>
      <th>UM</th>
      <th>from</th>
      <th>exp</th>
      <!-- <th>link</th> -->
    </tr>
    <MaterialRow
      v-for="(material, index) in mats"
      :key="index"
      :material="material"
    />
  </table>
</template>

<script>
import MaterialRow from './VBOMMaterialRow.vue';

export default {
  name: 'vrBomMat',
  components: { MaterialRow },
  props: {
    mats: {
      // type: Object,
      required: true,
    },
  },
};
</script>
