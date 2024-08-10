<template>
  <tr class="MaterialRow" :style="rowStyle" v-if="showRow">
    <td nowrap style="text-align: left; white-space: nowrap;" @click="copyTD">{{ material.mat }}</td>
    <td style="font-weight: bold;" @click="copyTD">{{ round(material.qty) }}</td>
    <td style="font-weight: bold; color: rgb(47,117,181)" @click="copyTD">{{ round(material.inv_oh) }}</td>
    <td v-if="!simplify" @click="copyTD">{{ round(material.inv_oo) }}</td>
    <td v-if="!simplify" @click="copyTD">{{ round(material.inv_wip) }}</td>
    <td v-if="simplify" @click="copyTD">{{ round(material.inv_oo + material.inv_wip) }}</td>
    <td style="font-weight: bold; color: rgb(255,102,0)" @click="copyTD">{{ round(material.totalOut) }}</td>
    <td v-if="!simplify" @click="copyTD">{{ round(material.left) }}</td>
    <td v-if="!simplify" @click="copyTD">{{ round(material.inv_ss) }}</td>
    <td v-if="!simplify" @click="copyTD">{{ material.below }}</td>
    <td @click="copyTD">{{ round(material.short) }}</td>

    <td v-if="editMode">
      <textarea v-model="material.notes" :rows="commentRows" cols="30" style="white-space: pre; overflow-x: hidden"></textarea>
    </td>
    <td v-else style="text-align: left" v-html="material.notes ? material.notes.replace('\n','<br>') : ''"></td>

    <td v-if="editMode">
      <input v-model.number="material.lead" type="number" step="1" min="1" style="width:50px" />
    </td>
    <td v-else>{{ material.lead }}</td>

    <td v-if="!simplify">{{ dollar(material.c_std) }}</td>

    <td v-if="editMode && !simplify">
      <input v-model.number="material.c_cus" type="number" step="0.01" min="0.01" style="width:50px" />
    </td>
    <td v-if="!editMode && !simplify">{{ material.c_cus }}</td>

    <td @click="copyTD">{{ material.for.join(', ') }}</td>
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
    editMode: {
      type: Boolean,
      default: false,
    },
    simplify: {
      required: true,
      validator: prop => typeof prop === 'boolean' || prop === null,
    },
  },
  data() {
    return {
      whole: [
        'EA',
        'SET',
        'KIT',
      ],
    };
  },
  computed: {
    showRow() {
      if (this.simplify && this.material.below === 'FALSE') return false;
      return true;
    },
    rowStyle() {
      if (this.material.below === 'FALSE') return '';
      const bold = 'font-weight: bold;';
      const black = 'color: black;';
      const red = 'color: red;';
      const critical = 'background: rgb(255,242,204);';
      if (this.material.below === 'SMALL') return `${black} ${bold} ${critical}`;
      if (this.material.below === 'SHORT') return `${black} ${bold} ${critical}`;
      if (this.material.below === 'MISSING') return `${red} ${bold}`;
      if (this.material.below === 'TRUE' && this.material.left < 0) return `${black} ${bold} background: rgb(248,203,173);`;
      if (this.material.below === 'TRUE') return `${black} ${bold} ${critical}`;
      return '';
      // return 'color: black; font-weight: bold';
    },
    commentRows() {
      if (this.material.notes) return this.material.notes.split('\n').length;
      return 1;
    },
  },
  methods: {
    round(val) {
      if (this.whole.indexOf(this.material.um) !== -1) {
        return val;
      }
      if (val) return val.toFixed(2);
      return '';
    },
    dollar(val) {
      if (val) return val.toFixed(2);
      return '';
    },
  },
};
</script>

<style scoped>
.MaterialRow td {
  text-align: right
}
.MaterialRow input {
  border-bottom: 1px solid gray;
}
.MaterialRow textarea {
  border-bottom: 1px solid gray;
}
</style>
