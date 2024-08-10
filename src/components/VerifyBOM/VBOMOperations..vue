<template>
  <table class="bomTable">
  <tr>
    <th>Part Num</th>
    <th>OP</th>
    <th>WC</th>
    <td>PPMH</td>
    <!-- <td>PPLH</td> -->
    <td>WC Notes</td>
    <!-- <td>_sh</td> -->
    <!-- <td>_qh</td> -->
    <!-- <td>_vh</td> -->
    <th>from</th>
    <th>exp</th>
    <!-- <th>link</th> -->
  </tr>
  <OperationRow
    v-for="(op, index) in ops"
    :key="index"
    :op="op"
  />
</table>
</template>

<script>
import OperationRow from './VBOMOperationRow.vue';

export default {
  name: 'vrBomOps',
  components: { OperationRow },
  props: {
    ops: {
      // type: Object,
      required: true,
    },
  },
};
</script>
