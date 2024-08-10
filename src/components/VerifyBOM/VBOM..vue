<template>
  <div class="qv-bom-item">
    <h2 @click="showItem = !showItem">
      {{ index+1 }}<v-icon :color="allCorrect ? 'green' : 'red'">
        {{ showItem ? 'expand_more' : 'chevron_right' }}
      </v-icon>{{ partNumber }}
    </h2>
    <div class="qv-bom-details" v-show="showItem" v-if="hasBom">
      <h3 @click="pnsShow = !pnsShow">
        <v-icon :color="allPnsCorrect ? 'green' : 'red'" small>
          {{ pnsShow ? 'expand_more' : 'chevron_right' }}
        </v-icon>Items / Part Numbers
      </h3>
      <BomItems class="bomTable" v-bind="vrBom" v-show="pnsShow" />

      <h3 @click="opsShow = !opsShow">
        <v-icon :color="allOpsCorrect ? 'green' : 'red'" small>
          {{ opsShow ? 'expand_more' : 'chevron_right' }}
        </v-icon>Operations
      </h3>
      <BomOperations class="bomTable" v-bind="vrBom" v-show="opsShow" />

      <h3 @click="matsShow = !matsShow">
        <v-icon :color="allMatCorrect ? 'green' : 'red'" small>
          {{ matsShow ? 'expand_more' : 'chevron_right' }}
        </v-icon>Materials
      </h3>
      <BomMaterials class="bomTable" v-bind="vrBom" v-show="matsShow" />

      <h3 v-if="errItem" @click="showErrors = !showErrors">
        <v-icon :color="errItem ? 'green' : 'red'" small>
          {{ showErrors ? 'expand_more' : 'chevron_right' }}
        </v-icon>Errors
      </h3>
      <BomErrors class="bomTable" :vrBom="vrBom" :error="error" v-if="errItem" v-show="showErrors" />

      <br>
      <v-btn v-if="missingOps.length > 0" small color="info" @click="copyMissingOps">Missing Operations</v-btn>
      <v-btn v-if="missingMats.length > 0" small color="info" @click="copyMissingMats">Missing Materials</v-btn>
      <br>

      <div v-if="vrBom.items.length > 0">
        <v-btn small color="yellow" @click="updateBOM">update BOM line {{ index+1 }}</v-btn>
        <v-btn small color="error" @click="updatePrice">!! update COST line {{ index+1 }} !!</v-btn>
      </div>
      <textarea v-if="missingMats.length > 0 || missingOps.length > 0" :id="praID" style="width:770px" />
    </div>
  </div>
</template>

<script>
import BomItems from './VBOMItems.vue';
import BomMaterials from './VBOMMaterials.vue';
import BomOperations from './VBOMOperations.vue';
import BomErrors from './VBOMErrors.vue';

export default {
  name: 'vrBom',
  components: {
    BomItems, BomMaterials, BomOperations, BomErrors,
  },

  props: {
    vrBom: {
      // type: Object,
      // required: true,
      default() { return { items: [], ops: [], mats: [] }; },
    },
    q: {
      // type: Object,
      required: true,
    },
    qty: {
      // type: Object,
      required: true,
    },
    error: {
    },
    index: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      showItem: false,
      errItem: false,
      pnsShow: true,
      pnsErr: false,
      matsShow: true,
      opsShow: true,
      showErrors: false,
    };
  },

  computed: {
    praID() {
      return `pra${this.index}`;
    },
    partNumber() {
      if (!this.vrBom) return '-- no BOM';
      if (!this.vrBom.items) return '-- no ITEMS';
      if (!this.vrBom.items[0]) return '-- no ITEM';
      return this.vrBom.items[0].pn;
    },
    hasBom() {
      if (!this.vrBom) return false;
      if (this.vrBom && this.vrBom.mats) return true;
      return false;
    },
    allPnsCorrect() { return true; }, // return !this.vrBom.items.find(vr => vr.exp.length > 0);  },
    allOpsCorrect() { return !this.vrBom.ops.find(vr => vr.exp.length > 0); },
    allMatCorrect() { return !this.vrBom.mats.find(vr => vr.exp.length > 0); },
    allCorrect() { return this.allPnsCorrect && this.allOpsCorrect && this.allMatCorrect; },
    missingOps() {
      const missingOps = [];
      if (!this.vrBom || !this.vrBom.ops) return false;
      for (const op of this.vrBom.ops) {
        if (op.exp.length > 0) {
          if (op.exp[0] === 'missing') {
            missingOps.push(
              `${op.pn
              }\t${op.op
              }\t${op.wc
              }\t${op._mh}`,
              // +'\t' + op._lh
            );
          }
        }
      }
      return missingOps;
    },
    missingMats() {
      const missingMats = [];
      if (!this.vrBom || !this.vrBom.mats) return false;
      for (const mat of this.vrBom.mats) {
        if (mat.exp.length > 0) {
          if (mat.exp[0] === 'missing') {
            missingMats.push(
              `${mat.pn
              }\t${mat.op
              }\t${mat.wc
              }\t${mat.sq
              }\t${mat.mat
              }\t${mat.qty
              }\t${mat.sf
              }\t${mat.um}`,
            );
          }
        }
      }
      return missingMats;
    },
  },

  watch: {
    partNumber: {
      handler: 'updateExpansions',
      immediate: true,
    },
  },

  // watch: { },

  methods: {
    updateExpansions() {
      this.opsShow = !this.allOpsCorrect;
      this.pnsShow = true; // !this.allPnsCorrect;
      this.matsShow = !this.allMatCorrect;

      if (!this.allCorrect) this.showItem = true;
      else this.showItem = false;

      if (this.error && this.error.length > 0) this.errItem = true;
      else if (this.vrBom && this.vrBom && this.vrBom.error && this.vrBom.error.length > 0) this.errItem = true;
      else this.errItem = false;

      if (this.allCorrect) {
        this.pnsShow = true;
        this.opsShow = false;
        this.matsShow = false;
      }
    },
    copyMissingOps() {
      const target = document.getElementById(this.praID);
      target.innerHTML = `${this.missingOps.join('\n')}\n`;
      target.focus();
      target.select();
      target.rows = this.missingOps.length + 1;
      this.copySelectionText();
      this.copySelectionText();
    },
    copyMissingMats() {
      const target = document.getElementById(this.praID);
      target.innerHTML = `${this.missingMats.join('\n')}\n`;
      target.focus();
      target.select();
      target.rows = this.missingMats.length + 1;
      this.copySelectionText();
      // let target = document.getElementById('pra'+this.index)
    },
    copySelectionText() {
      try {
        return document.execCommand('copy'); // run command to copy selected text to clipboard
      }
      catch (e) {
        return false;
      }
    },
    updateBOM() {
      this.$store.dispatch('quote/addItem', {
        index: this.index, query: this.q, qty: this.qty, o: { updateBOM: 1 },
      });
    },
    updatePrice() {
      this.$store.dispatch('quote/addItem', {
        index: this.index, query: this.q, qty: this.qty, o: { updateBOM: 1, updatePrice: 1 },
      });
    },
  },
};
</script>

<style>
.qv-bom-item h2{
  cursor: pointer;
  background-color: #000;
  color: #BBB;
  padding: 12px
}
.qv-bom-item h3{
  cursor: pointer;
  background-color: #DDD;
  padding: 6px
}
.qv-bom-details{
  margin: 0px 21px 21px 21px;
}
.bomTable {  color: #777 }
.bomTable { margin-left: 21px }
.bomTable tr:nth-child(even) {background: #EEE}
.incorrect {color: #E70; }
.txt-err {color: red; }
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
