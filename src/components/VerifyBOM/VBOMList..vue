<template>
  <div class="qv-bom-list">
    <BOM
      v-for="(item, index) in verifiedBOMs"
      :key="index"
      :index="index"
      v-bind="item"
    />
  </div>
</template>

<script>
import BOM from './VBOM.vue';

export default {
  name: 'BomList',
  components: { BOM },
  computed: {
    verifiedBOMs() {
      const list = this.$store.getters['quote/verifiedBOMs'];
      // console.table(list.map(i => {
      //   if (i.vrBom && i.vrBom.mats) return { pn: i.pn, ...i.vrBom.mats[0] };
      //   return { pn: i.pn, };
      // }))
      // console.table(list.map)
      return list;
    },
  },
};
</script>

<style>
.qv-bom-list{
    width: max-content;
    margin: auto;
    margin-bottom: 42px;
    overflow: auto;
    background: white;
    /* padding: 21px; */
}

.bomList {
  list-style: none;
  display: flex;
}
.orderSheet li {
  border: solid black;
  margin: 2px;
  width: 60vw;
}
</style>
