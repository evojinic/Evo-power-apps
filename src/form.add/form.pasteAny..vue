<template>
  <div class="paste-any">
    <h2>Input</h2>
    <textarea
      v-model="rawText"
      class="paste-any-text"
      outline
      label="Manual Entry Field"
      placeholder="Type in a part number or Paste quote from old gasket app"
    />

    <h2>Results</h2>
    <table class="paste-any-table">
      <tr>
        <th>ln#</th>
        <th>part number</th>
        <th>qty</th>
        <!-- <th>list</th> -->
        <!-- <th>unit</th> -->
      </tr>
      <tr
        v-for="(line, index) in manualEntry"
        :key="index"
      >
        <td>{{ line.ln || index+1 }}</td>
        <td>{{ line.pn }}</td>
        <td style="text-align: right">
          {{ line.qty }}
        </td>
        <!-- <td style="text-align: right">
          {{ line.list }}
        </td> -->
        <!-- <td style="text-align: right">
          {{ line.unit }}
        </td> -->
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'PasteAny',
  props: {
    // manualEntry: { type: Array },
  },

  data() {
    return {
      manualEntry: [],
      orderNumber: '',
      dueDate: '',
      rawText: '',
    };
  },

  computed: {
    editParts() { return this.$store.getters['dp/editParts']; },
    editLines() {
      let lns = '';
      for (const part of this.editParts) {
        lns += `${part.index + 1}\t${part.pn}\t${part.qty}\n`;
      }
      return lns;
    },
  },

  watch: {
    rawText: {
      handler: 'parseManualEntry',
    },
    editLines: {
      handler: 'setUpdateLines',
      immediate: true,
    },
  },

  methods: {
    setUpdateLines() {
      // console.log(this.editIndexArr)
      if (this.editLines.length > 0) this.rawText = this.editLines;
      else this.rawText = '';
    },

    // paste any
    parseGAppPrice(price) {
      if (price === undefined) return '';
      if (price.indexOf('USD') !== -1) return parseFloat(price.replace('$', '').replace(',', ''));
      return '';
    },

    parseManualEntry() {
      const manualEntry = [];
      // remove the dose text from the Gasket App table
      const parse = this.rawText.replace(/\n30ML Dose Unit Included/g, '');
      const allTextLines = parse.split(/\n/);

      for (let i = 0; i < allTextLines.length; i++) {
        if (allTextLines[i]) {
          const textR = allTextLines[i]
            .replace('1/2', '0.5')
            .replace('3/4', '0.75');

          // if (textR.toUpperCase().indexOf('ORDER# ') !== -1) {
          //   const orderStart = textR.toUpperCase().indexOf('ORDER# ') + 7;
          //   this.orderNumber = textR.slice(orderStart).replace(/\s.*/, '');
          // }
          // else if (textR.toLowerCase().indexOf('due') !== -1) {
          //   const dueStart = textR.toLowerCase().indexOf('due') + 4;
          //   const dueDate = textR.slice(dueStart).replace(/\s.*/, '');
          //   this.dueDate = dueDate.replace(/\//g, '-');
          // }
          // // else if (textR.indexOf('-') !== -1) {
          // else
          if (textR.indexOf('\t') !== -1) {
            const line = textR.split(/\t/);
            if (line[0] === 'Item' || line[1] === 'Item') continue;
            if (!isNaN(line[0]) && line[1]) {
              manualEntry.push({
                pn: line[1],
                qty: parseInt(line[2], 10),
                ln: parseInt(line[0], 10),
              });
            }
            else {
              if (!line[0]) continue;
              const list = this.parseGAppPrice(line[3]);
              const unit = this.parseGAppPrice(line[4]);
              manualEntry.push({
                pn: line[0],
                qty: parseInt(line[2], 10) || 1,
                list,
                unit,
              });
            }
          }
          else {
            if (!textR) continue;
            if (textR === 'Item') continue;
            manualEntry.push({
              pn: textR,
            });
          }
        }
      }
      // console.log(manualEntry)
      this.manualEntry = manualEntry;
      this.$emit('setImportLines', manualEntry);
    },
  },
};
</script>

<style scoped>
.paste-any{
  margin-left: 10px;
}
.paste-any-text{
  padding: 0.4em;
  margin-left: 1em;
  font-size: 0.85em;
  width: 320px;
  height: 250px;
  border: black 1px solid;
}
.paste-any-table {
  margin-left: 1em;
  font-size: 0.85em;
  width: 320px;
}
.paste-any-table td,th{
  padding: 0.1rem
}
</style>
