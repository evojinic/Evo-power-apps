<template>
  <tr>
    <th
      v-for="header in headers"
      :key="header.text"
      :class="{alignRight: (header.align==='right')}"
      :style="header.style ? header.style : ''"
      v-html="header.text"
    />
  </tr>
</template>

<script>
export default {
  name: 'EstTableHeaders',
  computed: {
    priceAdmin() { return this.$store.getters['account/priceAdmin']; },
    headers() {
      const headers = [
        {
          text: '',
          sortable: false,
        },
        {
          text: 'LN#',
          value: 'lineNumber',
          align: 'left',
          sortable: false,
        },
        {
          text: 'PART NUMBER<br>DESCRIPTION<br>TORQUE',
          value: 'pn',
          align: 'left',
          style: 'min-width: 320px',
          sortable: false,
        },
        {
          text: 'QUANTITY',
          value: 'qty',
          style: 'min-width: 100px',
          sortable: false,
        },
        {
          text: 'Weight EACH<br>W x D x H<br>Weight NET',
          align: 'right',
          value: 'net',
          style: 'min-width: 120px',
          sortable: false,
        },
      ];

      if (!this.priceAdmin) {
        headers.push({
          text: 'LIST',
          align: 'right',
          value: 'dev',
          style: 'min-width: 105px',
          sortable: false,
          showHeader: true,
        });
      }

      headers.push({
        text: 'Price EACH<br>Price NET',
        align: 'right',
        value: 'net',
        style: 'min-width: 140px',
        sortable: false,
      });

      if (this.priceAdmin) {
        headers.push(
          {
            text: 'Market High<br>List New<br>Sug. Low<br>Min Price<br>Admin Price',
            align: 'right',
            value: 'dev',
            style: 'min-width: 105px',
            sortable: false,
            showHeader: true,
          },
          {
            text: 'old gApp<br>new/old<br>SL Cost<br>GA Cost<br>Mat. Cost',
            align: 'right',
            value: 'dev',
            style: 'min-width: 105px',
            sortable: false,
            showHeader: true,
          },
        );
      }
      return headers;
    },
  },
};
</script>
