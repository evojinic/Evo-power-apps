<template>
  <table>
    <tr>
      <th>Part Num</th>
      <th>Description</th>
      <td>UM</td>
      <th>Product</th>
      <td>Planner</td>
      <td>Family</td>
      <th>from</th>
      <th>exp</th>
    </tr>
    <PartRow
      v-for="(item, index) in items"
      :key="index"
      :part="item"
    />
  </table>
</template>

<script>
import PartRow from './VBOMPartRow.vue';

export default {
  name: 'vrBomItems',
  components: { PartRow },

  props: {
    items: {
      // type: Object,
      required: true,
    },
  },
};
</script>
