<template>
  <div class="slideContainer">
    <h2 class="title">
      {{ brandList[brand] || brand }}
    </h2>
    <div class="discount">
      <v-switch
        v-if="isAdmin && !myQuote"
        v-model="adminSlider"
        style="display: inline-block"
        label="admin"
        color="orange"
        hide-details
      />
      <v-select
        v-if="brand === 'modular' && !disabled"
        label="Discount"
        v-model="sliderValue"
        style="width: 200px;"
        :items="discountDropDown"
        dense
      />
    </div>
    <div class="slide">
      <div v-if="disabled">
        <h3 style="border: solid gray 1px; text-align: center">
          Discount slider value is set by an admin; contact admin if it needs to change
        </h3>
      </div>
      <div v-else>
        <!-- top tick marks -->
        <div class="sectionDividers">
          <div
            v-for="(divider,index) in topDividers"
            :key="index"
            class="sectionDivider"
            :class="[divider.float, divider.border]"
            :style="{width: (divider.width) +'%'}"
            v-html="divider.text"
          />
        </div>
        <div style="clear: both" />
        <!-- slider -->
        <input
          v-model="sliderValue"
          type="range"
          min="0"
          :max="sliderRes"
          class="slider"
          :style="sliderBackground"
          :disabled="sliderDisabled"
        >
        <!-- bottom tick marks -->
        <div class="sectionDividers">
          <div
            v-for="(divider,index) in bottomDividers"
            :key="index"
            class="sectionDivider"
            :class="[divider.float, divider.border]"
            :style="{width: (divider.width) +'%'}"
            v-html="divider.text"
          />
        </div>
        <div style="clear: both" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'BrandSlider',
  props: {
    brand: {
      type: String,
      required: true,
    },
    value: {
      default: -1,
      required: true,
    },
    admin: {
      default: -1,
      required: true,
    },
    sliderRes: {
      type: Number,
      required: true,
    },
    sliderAvg: {
      type: Object,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    myQuote: {
      type: Boolean,
      default: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      adminSlider: false,
      key: 'value',
      disabled: false,
      sliderValue: 65,
      limit: 'ms',
      brandList: {
        DFS: 'Defender Fire Safe',
        DF: 'Defender',
        IG: 'IsoGuard',
        IM: 'IsoMate',
        DFT: 'Defender Tandem',
        KI: 'Kamm Pro Isolation',
        MS: 'Matrix Sheet',
        LS: 'Lamons Sheet',
        DRG: 'Defender Rescue',
        IGS: 'IsoGuard Spring',
        IGST: 'Strainer',
        KITS: 'Sleeves & Washers',
        modular: 'Modular Seals',
      },
    };
  },

  watch: {
    adminSlider(newVal, oldVal) {
      if (newVal === true) {
        this.limit = 'al';
        this.key = 'admin';
        this.initSliderValue();
      }
      else if (newVal !== oldVal) {
        this.limit = 'ms';
        this.key = 'value';
        this.clearAdminValue();
        this.initSliderValue();
      }
    },
    sliderValue: 'setSlider',
    value: 'initSliderValue',
    admin: 'initSliderValue',

  },

  mounted() {
    // console.log('sliderAvg --->', this.sliderAvg)
    if (this.isAdmin && this.admin >= 0) this.adminSlider = true;
    if (this.isAdmin && this.myQuote) this.adminSlider = true;
    this.initSliderValue();
  },

  computed: {
    ...mapState('quote', ['sliderAvgArr']),
    // sliderAvg(){
    //   return this.sliderAvgArr[this.brand];
    // },
    topDividers() {
      const dividers = [];

      if (this.adminSlider === true) {
        dividers.push({
          border: 'BL',
          float: 'FL',
          width: this.avgSuggestedPrice,
          text: 'Admin Limit',
        });

        if (this.avgSuggestedPrice) {
          dividers.push({
            border: 'BL',
            float: 'FL',
            text: 'Sug. Price',
          });
        }
      }
      else if (this.avgSuggestedPrice) {
        dividers.push({
          // border: 'BL',
          float: 'FL',
          width: this.avgSuggestedPrice,
          text: '&nbsp;',
        });
        dividers.push({
          border: 'BL',
          float: 'FL',
          text: 'Sug. Price',
        });
      }

      dividers.push({
        border: 'BR',
        float: 'FR',
        text: 'Mrk. List High',
      });

      return dividers;
    },
    bottomDividers() {
      const dividers = [];
      dividers.push({
        // border: 'BL',
        float: 'FL',
        width: this.avgPriceLimit,
        text: '&nbsp;',
      });
      dividers.push({
        border: 'BL',
        float: 'FL',
        text: 'Min. Price',
      });

      dividers.push({
        // border: 'BR',
        float: 'FR',
        width: 100 - this.avgListNew,
        text: '&nbsp;',
      });
      dividers.push({
        border: 'BR',
        float: 'FR',
        text: '&starf; List Price',
      });

      return dividers;
    },
    suggested() { return this.sliderAvg.sp; },
    redStart() { return 0; },
    sliderDisabled() { return this.brand === 'modular'; },
    // avgMarginGoal() {
    //   if (!this.adminSlider && this.sliderAvg['mg'] <= this.sliderAvg.ms ) return 0;
    //   let orangePees = this.sliderAvg['mg']*100;
    //   if ( isNaN(orangePees) ) return 0;
    //   return orangePees;
    // },
    avgSuggestedPrice() {
      if (!this.adminSlider && this.sliderAvg.sp <= this.sliderAvg.ms) return 0;
      const purplePees = this.sliderAvg.sp * 100;
      if (isNaN(purplePees)) return 0;
      return purplePees;
    },
    avgPriceLimit() {
      if (!this.adminSlider) return 0;
      const yellowPees = this.sliderAvg.ms * 100;
      if (isNaN(yellowPees)) return 0;
      return yellowPees;
    },
    avgListNew() {
      return this.sliderAvg.lp * 100;
    },
    sliderBackground() {
      const blur = 0;
      let colors = [];

      // red
      // if (this.avgMarginGoal > 0){
      //   colors = [
      //     '#B10 0%',
      //     '#B10 '    +(this.avgMarginGoal-blur)+'%',
      //   ]
      // }
      if (this.avgPriceLimit > 0) {
        colors = [
          '#B10 0%',
          `#B10 ${this.avgPriceLimit - blur}%`,
        ];
      }

      // Orange
      // if (this.avgMarginGoal === 0){
      //   if (this.adminSlider){
      //     colors = colors.concat([
      //       'orange 0%',
      //       'orange ' +(this.avgPriceLimit-blur)+'%',
      //     ])
      //   }
      // }
      // else if (this.avgMarginGoal){
      //   colors = colors.concat([
      //     'orange ' +(this.avgMarginGoal+blur)+'%',
      //     'orange ' +(this.avgPriceLimit-blur)+'%',
      //   ])
      // }

      // yellow
      if (this.avgSuggestedPrice === 0) {
        colors = colors.concat([
          '#037 0%',
          `#037 ${this.avgListNew + blur}%`,
        ]);
      }
      else {
        colors = colors.concat([
          `#EE0 ${this.avgPriceLimit + blur}%`,
          `#EE0 ${this.avgSuggestedPrice - blur}%`,
        ]);
      }

      if (this.avgSuggestedPrice) {
        // push blue start
        colors.push(`#037 ${this.avgSuggestedPrice + blur}%`);
        // push blue end
        colors.push(`#037 ${this.avgListNew - blur}%`);
      }

      // blue
      colors = colors.concat([
        `#037 ${this.avgListNew + blur}%`,
        '#037 100%',
      ]);
      const style = `background-image: linear-gradient(to right, ${colors.join(', ')}); ${this.sliderDisabled ? 'opacity: 0.2' : ''}`;
      // console.log(' - - - '+ this.brand +' - - -');
      // console.log(this.sliderAvg);
      // console.log(colors);
      // console.log(style);
      return style;
    },
    discountDropDown() {
      const dropdown = [];
      if (this.adminSlider) dropdown.push({ value: 0, text: 'Admin' });
      if (this.adminSlider) dropdown.push({ value: this.sliderAvg.ms * this.sliderRes, text: 'Distributor 25% off' });
      else dropdown.push({ value: 0, text: 'Distributor 25% off' });
      dropdown.push({ value: this.sliderAvg.sp * this.sliderRes, text: 'Contractor 10% off' });
      dropdown.push({ value: this.sliderAvg.lp * this.sliderRes, text: 'List' });
      dropdown.push({ value: this.sliderRes, text: 'Market' });
      return dropdown;
    },
  },

  methods: {
    ...mapActions('quote', ['setSliderValue']),
    initSliderValue() {
      // admin value has been set render admin slider
      if (this.admin >= 0 && this.limit === 'al') {
        this.sliderValue = this.admin;
        this.adminSlider = true;
      }
      // no admin value render Lamons rep slider
      else if (this.value >= 0 && this.limit === 'ms') {
        this.sliderValue = this.value;
      }
      else {
        this.sliderValue = parseInt(this.suggested * this.sliderRes, 10);
      }
      // this.setSlider(this.sliderValue);
      this.disabled = this.admin >= 0 && !this.isAdmin;
    },
    setSlider(value, oldValue) {
      // eslint-disable-next-line eqeqeq
      if (value != oldValue) {
        this.setSliderValue({ index: this.index, key: this.key, value });
      }
    },
    clearAdminValue() {
      // negative value will clear value
      this.setSliderValue({ index: this.index, key: 'admin', value: -1 });
    },
  },

};
</script>

<style scoped>
.slideContainer {
  display: grid;
  width: 100%;
  padding: 10px 0px;
  grid-auto-flow: column;
  align-items: center;
  column-gap: 10px;
  grid-template-columns: 100px auto 1fr;
  grid-template-areas:
      'title discount slide';
}

.title { grid-area: title; text-align: right; }
.slide { grid-area: slide; }
.discount { grid-area: discount; }

@media only screen and (max-width: 800px){
  .slideContainer {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'title discount'
      'slide slide';
  }
  .title { text-align: left; }
}

.FR { float: right; }
.FL { float: left; }

.BR {
  text-align: right;
  padding-right: 3px;
  margin-left: 1px;
  border-right: solid gray 1px;
}

.BL {
  text-align: left;
  padding-left: 3px;
  border-left: solid gray 1px;
}

.sectionDividers {
  width: 100%;
  font-size: 0.8em;
  font-weight: bold;
}

.sectionDividerLeft {
  border-left: solid gray 1px;
  float: left;
  text-align: left;
  padding-left: 10px;
}

.sectionDividerRight {
  border-right: solid gray 1px;
  float: right;
  text-align: right;
  padding-right: 10px;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  vertical-align: middle;
  outline: solid;
  outline-width: 1px;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: height .2s;
  transition: opacity .2s;
}

.slider:hover, .slider:focus, .slider:active {
  opacity: 1;
  height: 15px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 5px;
  height: 45px;
  background: #000;
  cursor: pointer;
  opacity: 0.7;
}

.slider::-moz-range-thumb {
  width: 5px;
  height: 45px;
  background: #000;
  cursor: pointer;
  opacity: 0.7;
}
</style>
