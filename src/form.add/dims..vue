<template>
  <div class="selection_spec">
    <div class="f-card">
      <div v-if="dims && dims.flangeOD ">
        Outer Dia = <strong>{{ dims.flangeOD }}"</strong>
        <br>Holes@bcd = <strong>{{ dims.hd }}"</strong> x <strong>{{ dims.holeQty }}</strong> @ <strong>{{ dims.bcd }}"</strong>
        <br>F-type OD = <strong>{{ dims.fOD }}"</strong>
        <div v-show="dims.RF_d">Raised Face OD = <strong>{{ dims.RF_d }}"</strong></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpecDims',
  computed: {
    dims() { return this.$store.getters['dp/dims'] || {}; },
  },
};
</script>

<style scoped>
</style>
