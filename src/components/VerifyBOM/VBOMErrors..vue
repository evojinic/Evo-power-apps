<template>
  <table>
    <tr>
      <th>Part Num</th>
      <th>from</th>
      <th>exp</th>
      <th>link</th>
    </tr>
    <tr
      v-for="(vrError, index) in vrBom.errors"
      :key="index"
    >
      <td>{{ vrError.partNum }}</td>
      <td>{{ vrError.type }}</td>
      <td>{{ vrError.exp }}</td>
    </tr>
    <tr v-if="error">
      <td colspan="4">
        {{ error }}
      </td>
    </tr>
    <tr v-if="vrBom && vrBom.error">
      <td colspan="4">
        {{ vrBom.error[0] }}
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'vrBomError',
  props: {
    vrBom: {
      // type: Object,
      required: true,
    },
    error: {},
  },
};
</script>
