<template>
  <APgShade
    v-if="quote_id && quoteError"
    :error="quoteError"
    :quote_id="quote_id"
  />
  <!-- TODO create a saving and loading shade -->
  <!-- <APgShade v-if="quote_id && quoteError" type="forbidden" :quote_id="quote_id" /> -->
  <div
    v-else
    id="estimator"
  >
    <transition name="fast-fade">
      <div
        v-show="updatingQuote || loadingQuote"
        id="save-shade"
      >
        <h3 v-if="updatingQuote">
          SAVING
        </h3>
        <ga-spinner />
        <h3 v-if="loadingQuote">
          LOADING
        </h3>
      </div>
    </transition>
    <PrintBook
      :show="viewBook"
      :quote="editQuote"
      :settings="bookSettings"
      @toggleValue="toggleValue"
    />
    <div id="pg">
      <div id="pg-content">
        <qData
          style="padding: 12px"
          :quote="editQuote"
        />

        <!--
          this is not working as expected, because "add form" div have moved out outside of table div
          <div v-click-outside="clearSelection">
        -->
        <div>
          <EstTbl
            id="est-table"
            :edit-index-arr="editIndexArr"
            :loading-quote="loadingQuote"
            :can-edit-quote="canEditQuote"
            @editEditIndex="editEditIndex"
          />

          <contextNav
            :buttons="buttons"
            :right="true"
            @pushToggle="toggleValue"
          />
        </div>

        <div style="margin: 5px auto; max-width: 1100px">
          <brandSlider
            v-for="(slider,index) in editQuote.qSliders"
            :key="index"
            :index="index"
            :brand="slider.brand || ''"
            :admin="slider.admin"
            :value="slider.value"
            :slider-res="slider.resolution || 10000"
            :slider-avg="slider.avg"
            :is-admin="priceAdmin"
            :my-quote="myQuote"
          />
        </div>

        <div class="est-footer">
          <div class="totalSection">
            <div v-if="qd.weightNet" style="max-width: 200px">
              <v-text-field
                :value="`${numberFormat(qd.weightNet, 1)}lb | ${numberFormat(qd.weightNet * 0.45359237, 1)}kg`"
                reverse
                readonly
                label="ESTIMATED Net Weight"
                disabled
              />
            </div>
            <div v-if="qd.priceList > 0" style="max-width: 170px">
              <v-text-field
                :value="numberFormat(qd.priceList, 2)"
                reverse
                readonly
                label="Total List Price"
                suffix="$"
                disabled
              />
            </div>
            <div v-if="qd.priceNet > 0" style="max-width: 170px">
              <v-text-field
                :value="numberFormat(qd.priceNet, 2)"
                reverse
                readonly
                label="Total Sale Price"
                suffix="$"
              />
              <v-text-field v-if="showWaterMarketDiscount"
                :value="numberFormat(qd.priceNet * 0.95, 2)"
                reverse
                readonly
                label="ORDER in 48HRS Price"
                suffix="$"
              />
            </div>
            <div v-if="qd.priceList > 0 && qd.priceNet > 0" style="max-width: 300px">
              <v-text-field
                v-model="discountPercentage"
                label="Discount"
                prefix="%"
                style="display: inline-block; max-width: 80px"
                reverse
                :disabled="editQuote.qSliders.length !== 1"
                :readonly="recalculateDisabled"
                @keyup.enter.native="recalculateDiscount()"
              />
              <v-btn v-if="editQuote.qSliders.length === 1"
                style="display: inline-block"
                :disabled="recalculateDisabled"
                @click="recalculateDiscount()"
              >
                RECALCULATE
              </v-btn>
            </div>
            <div v-if="showSideOfBolts">
              <SideOfBoltsToggle />
            </div>
            <!-- <div>
              <v-checkbox
                label="Expedited"
                v-model="editQuote.qData.expedite"
                @click="expediteChange()"
              ></v-checkbox>
            </div> -->
          </div>
        </div>

        <div class="e-buttons-bottom">
          <contextNavBtn
            v-for="(bottomButton, id) in otherButtons"
            :key="id"
            :button="bottomButton"
            @push="toggleValue"
          />
        </div>
      </div>

      <div id="pg-bottom-nav">
        <contextNavBtn
          v-for="(bottomButton, id) in bottomButtons"
          :key="id"
          :button="bottomButton"
          @push="toggleValue"
        />
      </div>

      <transition name="fast-fade">
        <div
          v-show="formShow"
          id="pg-content-shade"
          @click="formShow = false"
        />
      </transition>
      <transition name="fast-fade">
        <addForm
          ref="addForm"
          v-show="formShow"
          class="pg-form"
          :form-show="formShow"
          :form-show-always="formShowAlways"
          :parts="editQuote.qItems"
          :edit-index-arr="editIndexArr"
          @toggleValue="toggleValue"
          @getItem="getItem"
          @moveIndex="moveIndex"
          @clearIndexEdit="clearSelection"
        />
      </transition>

      <transition name="fast-fade">
        <div
          v-if="editQuote && editQuote.status"
          class="vq-status-popup"
          :class="{hide: !statusUpdate}"
          @click.self="statusUpdate = false"
        >
          <QStatusActions
            class="vq-status-content"
            :header="true"
            :quote="editQuote"
            :current-status="editQuote.status"
            @closeStatusUpdate="statusUpdate = false"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import contextNavBtn from '@/components/contextNavBtn.vue';
import brandSlider from '@/components/brandSlider.vue';
import addForm from '@/form.add/form.add_.vue';
import PrintBook from '@/components/PrintBookPopUp.vue';
import helpers from '@/_helpers/helpers';
import SideOfBoltsToggle from '@/pages/Quotes/SideOfBolts.vue';

import { mapActions, mapGetters, mapState } from 'vuex';
import QStatusActions from './QStatusActions.vue';
import EstTbl from './EstTbl.vue';
import qData from './QData.vue';

export default {

  name: 'QuoteEstimate',

  components: {
    contextNavBtn,
    EstTbl,
    QStatusActions,
    brandSlider,
    qData,
    PrintBook,
    addForm,
    SideOfBoltsToggle,
  },

  mixins: [helpers],

  props: {
    quote_id: {
      type: String,
    },
  },

  data() {
    return {
      statusUpdate: false,
      visible: false,
      editIndexArr: [],
      appear: false,
      formShow: false,
      formShowAlways: false,
      viewBook: false,
      bookSettings: {
        include: ['drawings'],
      },
      discountPercentage: 0,
      window: {
        width: 0,
        height: 0,
      },
    };
  },

  watch: {
    'quote_id': {
      handler: 'loadQuote',
      immediate: true,
    },
    'editQuote.qData.priceNet': {
      handler: 'setPercentDiscount',
      immediate: true,
    },
  },

  created() {
    if (this.quote_id) document.title = `GA - ${this.quote_id}`;
    else document.title = 'GA - new quote';

    if (!this.quote_id && this.itemCount === 0) this.formShow = true;

    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },

  computed: {
    showWaterMarketDiscount() {
      return this.$store.getters['account/distDNV'] && this.$store.getters['quote/waterMarketDiscount'];
    },
    // quote
    ...mapState('quote', ['quoteError', 'sliderAvg', 'canSave']),
    ...mapState('quote', { loadingQuote: 'isGetPending' }),
    ...mapState('quote', { updatingQuote: 'isUpdatePending' }),
    ...mapState('quote', { creatingQuote: 'isCreatePending' }),
    ...mapState('quote', { editQuote: 'quote' }),

    qd() { return this.$store.getters['quote/qData']; },

    // other
    ...mapGetters('account', [
      'user',
      'isDev',
      'roleBOM',
      'roleINV',
      'priceAdmin',
    ]),

    canEditQuote() {
      return (
        this.editQuote.status === 'notSaved' ||
        this.editQuote.status === 'new' ||
        this.editQuote.status === 'new' ||
        this.editQuote.status === 'pending'
      );
    },

    items() { return this.editQuote.qItems || []; },
    itemCount() { return this.items.length; },
    hasItems() { return this.itemCount > 0; },
    showSideOfBolts() {
      for (const i of this.items) {
        if (i && i.q && ['ik_gasket', 'ik_kit', 'ik_swSet', 'gasket_kamm', 'gasket_sw'].indexOf(i.q.product) !== -1) return true;
      }
      return false;
    },

    editLineString() {
      if (this.editIndexArr.length === this.itemCount) return 'ALL';
      return this.editIndexArr.reduce((str, num) => `${str} | ${num + 1}`, '');
    },

    // context nav buttons
    buttons() {
      if (!this.canEditQuote) return [];
      const plural = this.editIndexArr.length > 1 ? 's' : '';
      let cbl = [];

      if (this.editIndexArr.length > 0) {
        cbl = [
          {
            text: `Edit Line${plural} ${this.editLineString}`, icon: 'edit', color: 'green', action: 'formShow',
          },
          {
            text: `Delete Line${plural} ${this.editLineString}`, icon: 'delete', color: 'error', action: 'removeLines',
          },
          {
            text: 'Clear Selection', icon: 'block', color: 'black', small: true, action: 'clearTableSelection',
          },
        ];
      }
      else {
        cbl = [{ text: 'Add Item', icon: 'add', action: 'formShow' }];
        if (this.hasItems) {
          cbl.push({
            text: 'Select All', icon: 'playlist_add_check', color: 'green', small: true, action: 'selectAll',
          });
        }
      }
      if (this.formShowAlways) cbl.splice(0, 1);
      return cbl;
    },

    bottomButtons() {
      const bbl = [];
      if (this.hasItems) {
        if (this.quote_id) bbl.push({ text: 'Print', icon: 'print', to: { path: `/p/q/${this.quote_id}` } });
        else bbl.push({ text: 'Print', icon: 'print', to: { path: '/p/e/' } });
        const saveBtn = {
          text: 'Save', icon: 'save', action: 'saveQuote', disable: !this.canSave, disableText: 'Missing Customer Name'
        };
        if (this.quote_id) saveBtn.color = 'green';
        bbl.push(saveBtn);
      }
      bbl.push({
        text: 'My Quotes', icon: 'arrow_back', color: 'black', small: true, to: { name: 'quotes' },
      });
      if (this.editQuote.status !== 'notSaved' && this.editQuote.status !== 'shipped') {
        bbl.push({
          text: 'Status', icon: 'traffic', color: 'black', small: true, action: 'statusUpdate',
        });
      }
      return bbl;
    },

    otherButtons() {
      const obl = [];
      if (!this.hasItems) return obl;
      obl.push({
        text: 'New', icon: 'library_add', color: 'red', small: true, action: 'clearQuote',
      });
      obl.push({
        text: 'Copy Paste', icon: 'file_copy', color: 'black', small: true, action: 'copyPaste',
      });
      if (this.roleBOM) {
        obl.push({
          text: 'BOM', icon: 'compare', color: 'black', small: true, action: 'BOM',
        });
      }
      if (this.roleINV) {
        obl.push({
          text: 'Material Verify', icon: 'flare', color: 'black', small: true, action: 'verifyMaterial',
        });
      }
      return obl;
    },

    recalculateDisabled() { return this.editQuote.qSliders.length > 1; },

    myQuote() {
      if (!this.editQuote.user_id) return true;
      if (this.editQuote.user_id === this.user._id) return true;
      return false;
    },

  },

  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
      if (this.window.width >= 1280) {
        this.formShow = true;
        this.formShowAlways = true;
      }
      else this.formShowAlways = false;
    },
    // context nav handle
    toggleValue(value) {
      if (value === 'clearTableSelection') {
        this.clearSelection();
      }
      else if (value === 'selectAll') {
        this.editIndexArr = this.items.map((item, index) => index);
      }
      else if (value === 'removeLines') {
        for (let i = this.editIndexArr.length - 1; i >= 0; i--) {
          this.removeLine(this.editIndexArr[i]);
        }
      }
      else if (value === 'formShow') {
        this.formShow = !this.formShow;
        if (this.formShowAlways) {
          this.formShow = true;
        }
      }
      else if (value === 'clearQuote') {
        // eslint-disable-next-line
        let clearConfirmed = confirm('All Current Progress Will be Lost');
        // if (clearConfirmed) this.getQuote('clear');
        if (clearConfirmed) {
          this.getQuote('clear');
          this.$router.push('/estimator');
          this.$store.dispatch('dp/clearForm');
        }
      }
      else if (value === 'saveQuote') {
        this.saveQuote();
      }
      else if (value === 'viewDrawings') {
        this.bookSettings.include = ['drawings'];
        this.viewBook = !this.viewBook;
      }
      else if (value === 'dimTable') {
        this.bookSettings.include = ['dimTable'];
        this.viewBook = !this.viewBook;
      }
      else if (value === 'viewQuote') {
        this.bookSettings.include = ['quote'];
        this.viewBook = !this.viewBook;
      }
      else if (value === 'copyPaste') {
        this.bookSettings.include = ['copyPaste'];
        this.viewBook = !this.viewBook;
      }
      else if (value === 'BOM') {
        this.verifyBOM();
        this.bookSettings.include = ['BOM'];
        this.viewBook = !this.viewBook;
      }
      else if (value === 'verifyMaterial') {
        this.verifyMaterial();
        this.bookSettings.include = ['verifyMaterial'];
        this.viewBook = !this.viewBook;
      }
      else if (this[value] !== undefined) {
        // console.log(`${value} <-- toggled`);
        this[value] = !this[value];
      }
      // else {
      //   console.log(`${value} <-- key does not exist`);
      // }
    },
    clearSelection() {
      if (this.editIndexArr.length > 0) {
        this.editIndexArr = [];
      }
    },

    // lin the part list table to gasket form
    editEditIndex(listIndex, remove) {
      // console.log(this.editIndexArr)
      const loc = this.editIndexArr.indexOf(listIndex);
      if (remove) {
        if (loc !== -1) {
          // console.log('remove '+listIndex+' @ '+loc);
          this.editIndexArr.splice(loc, 1);
        }
      }
      else if (loc === -1) {
        // console.log('add '+listIndex)
        this.editIndexArr.push(listIndex);
      }
      this.editIndexArr.sort((a, b) => a - b);
      // console.log(this.editIndexArr)
    },

    setPercentDiscount() {
      // console.log(this.editQuote.qData.discount);
      this.discountPercentage = this.numberFormat(this.editQuote.qData.discount, 2);
    },

    ...mapActions('quote', [
      'getQuote',
      'updateQuote',
      'createQuote',
      'addItem',
      'moveItem',
      'removeItem',
      'setSliderValue',
      'verifyBOM',
      'verifyMaterial',
    ]),

    moveIndex(destination) {
      // this.editIndex[0] =
      // if (this.editIndexArr === 1)
      const from = this.editIndexArr[0];
      let to = null;
      if (destination === 'down') to = from + 1;
      else if (destination === 'up') to = from - 1;
      if (to >= 0 && to < this.itemCount) {
        this.moveItem({ from, to });
        this.editIndexArr = [to];
      }
    },

    getItem(query, editIndex, qty) {
      this.addItem({ index: editIndex, query, qty });
      if (editIndex >= 0) this.editEditIndex(editIndex, true);
    },

    removeLine(editIndex) {
      const partRef = this.items[editIndex];
      const value = confirm(`Line ${editIndex + 1} will be removed\n\n${partRef.pn}\n${partRef.desc}\n\nRemove the line?`,); // eslint-disable-line
      if (value === true) {
        this.removeItem(editIndex);
        this.editEditIndex(editIndex, true);
      }
      // else {
      //   console.log('Cancel Confirmed');
      // }
    },

    saveQuote() {
      if (!this.canSave) return;

      // TODO update what changed
      const updateData = {
        qData: this.editQuote.qData,
        qItems: this.editQuote.qItems,
        qSliders: this.editQuote.qSliders,
        dist: this.editQuote.dist,
        user_id: this.user._id,
      };

      if (this.editQuote._id) {
        updateData._id = this.editQuote._id;
        this.updateQuote({ data: updateData });
      }
      else {
        this.createQuote({ data: updateData }).then(() => {
          if (this.user.defaults && this.user.defaults.quoteSaved === 'list') this.$router.push('/quotes');
          else this.$router.push(`/estimator/${this.editQuote._id}`);
        });
      }
    },
    // updates
    loadQuote() {
      if (this.quote_id) this.getQuote(this.quote_id);
      else this.getQuote('clear');
    },
    recalculateDiscount(wishDiscount, iteration) {
      if (this.recalculateDisabled) return false;

      let curIteration = iteration || 0;
      const calcDiscount = wishDiscount || this.discountPercentage;

      if (curIteration > 50) return false;
      curIteration++;

      const index = 0;
      const slider = this.editQuote.qSliders[index];
      let key = 'value';
      if (slider.admin >= 0) {
        key = 'admin';
      }
      if (calcDiscount === '') {
        this.setSliderValue({ index, key, value: -1 });
        // iteration = 51;
        return true;
      }

      const multi = slider.resolution / 100;
      const step = Math.floor(this.editQuote.qData.discount * multi - calcDiscount * multi);
      // console.log({ step, multi, calcDiscount, curIteration });
      // stop recursive call if the discount matched
      if (step === 0) return true;
      const value = slider[key];
      // stop recursive call if slider at the minimum
      if (value === 0 && step < 0 || value === slider.resolution && step > 0) return true;
      let newValue = value + step;
      // stop if newValue is not number
      if (isNaN(newValue)) return true;
      // stop at 0
      if (newValue <= 0) newValue = 0;
      // stop at 100
      else if (newValue >= slider.resolution) newValue = slider.resolution;

      this.setSliderValue({ index, key, value: newValue });
      this.recalculateDiscount(calcDiscount, curIteration);

      return true;
    },
  },
};
</script>

<style scoped>
.vq-status-popup{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  /* overflow: auto; */
}

.vq-status-content{
  background-color: white;
  width: 370px;
  padding: 2.1rem;
  margin: 30px auto 30px auto;
}

.est-footer { padding: 0px 54px 0px 12px; }
.totalSection { display: flex; flex-wrap: wrap; justify-content: center; }
.totalSection :first-child { margin: 1px 5px; }

.e-buttons-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-right: 54px;
}

.break {
  clear: both;
}
</style>
