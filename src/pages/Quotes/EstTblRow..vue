<template>
  <tr @click="$emit('lineClick')">
    <td style="text-align: center">
      <ga-spinner v-if="lineStatus[index]" />
      <div
        v-if="!lineStatus[index] && thumb"
        class="thumbnail"
        v-html="thumb.front || thumb.side"
      />
    </td>

    <td v-if="pn !== 'exp' && !parentQty > 0" style="font-size: 1.2em; font-weight: bold;">
      {{ ln }}
    </td>
    <td v-else />

    <ItemPN style="text-align: left; font-size: 0.85rem" v-bind="{ pn, desc, q, d, trq, error, fasteners }" :showTorque="true" />

    <td @click.stop>
      <div v-if="parentQty" style="text-align: center; color: #999">
        {{ parentQty * qty }}
      </div>
      <v-text-field
        v-else-if="qty >= 0"
        v-model="qty"
        hide-details
        type="number"
        :min="step || 1"
        :step="step || 1"
        reverse
        :disabled="!canEditQuote"
        style="max-width:54px"
        @change="updateItemQty({index: index, qty: qty})"
        @click="updateItemQty({index: index, qty: qty})"
      />
    </td>

    <ItemWeight :pack="pack" :qty="qty" />

    <td v-if="!priceAdmin && p.lp" style="color: #AAA" class="txt-right">
      <div>{{ numberFormat(p.lp, 2) }}</div>
    </td>
    <td v-else-if="!priceAdmin && !p.lp" />

    <ItemPrice style="font-size: 1.2rem"
      :price="p.up ? p.up : 0"
      :error="p.error ? p.error : ''"
      :qty="parentQty ? parentQty * qty : qty"
      :product="q.product"
      :fasteners="fasteners"
    />

    <!-- admin section -->
    <Prices v-if="priceAdmin" style="font-size:0.7em; color: #AAA" class="txt-right" v-bind="p" />
    <Costs v-if="priceAdmin" style="font-size:0.7em; color: #AAA" class="txt-right" v-bind="c" :pLN="p.up" :pOG="p.og" />
  </tr>
</template>

<script>
import helpers from '@/_helpers/helpers';
import ItemPN from '@/components/Table/ItemPN.vue';
import ItemPrice from '@/components/Table/Price.vue';
import ItemWeight from '@/components/Table/Weight.vue';
import Prices from '@/components/Table/Prices.vue';
import Costs from '@/components/Table/Costs.vue';

export default {
  name: 'EstTableRow',
  mixins: [helpers],
  components: { ItemPN, ItemPrice, ItemWeight, Prices, Costs },
  props: {
    canEditQuote: { type: Boolean, default: false },
    index: { required: true },
    qty: { default: 1 },
    ln: { type: String },
    pn: { type: [String, Object] },
    desc: { type: String },
    q: { type: Object, default() { return {}; } },
    d: { type: Object, default() { return {}; } },
    c: { type: Object, default() { return {}; } },
    p: { type: Object, default() { return { up: 0, lp: 0 }; } },
    trq: { type: Object, default() { return {}; } },
    pack: { type: Array, default() { return []; } },
    thumb: { type: Object, default() { return {}; } },
    fasteners: { type: Object, default() { return {}; } },
    error: { },
    parentQty: { type: Number, default: 0 },
  },

  computed: {
    lineStatus() { return this.$store.getters['quote/lineStatus']; },
    priceAdmin() { return this.$store.getters['account/priceAdmin']; },
    step() { return this.qtyIncrement(this.q); },
  },

  methods: {
    updateItemQty(payload) { return this.$store.dispatch('quote/updateItemQty', payload); },
  },
};
</script>

<style>
.thumbnail svg { height: 60px; width: 60px; padding: 2px; }
</style>
