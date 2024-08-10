/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vuetify/dist/vuetify.min.css';

import Vue from 'vue';
// import Vuetify from 'vuetify';
import Vuetify, {
  VAlert,
  VIcon,
  VBtn,
  VCard,
  VToolbar,
  VToolbarSideIcon,
  VDialog,
  VSpacer,
  VList,
  VSwitch,
  VSelect,
  VTextarea,
  VCheckbox,
  VRadio,
  VTextField,
  VForm,
  VDataTable,
  VProgressLinear,
  VApp,
  VTooltip,
  VListTile,
  VListTileTitle,
  VListTileAction,
  VListTileContent,
  VNavigationDrawer,
  VSlideYTransition,
  VRadioGroup,
} from 'vuetify/lib';
import { Ripple } from 'vuetify/lib/directives';
import registerStoreModule from '@/_helpers/registerStoreModule';

import GaSpinner from './components/GaSpinner.vue';
import APgShade from './components/APgShade.vue';
import contextNav from './components/contextNav.vue';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(Vuetify, {
  components: {
    APgShade,
    GaSpinner,
    contextNav,
    VAlert,
    VIcon,
    VBtn,
    VCard,
    VToolbar,
    VToolbarSideIcon,
    VDialog,
    VSpacer,
    VList,
    VSwitch,
    VSelect,
    VTextarea,
    VCheckbox,
    VRadio,
    VTextField,
    VForm,
    VDataTable,
    VProgressLinear,
    VApp,
    VTooltip,
    VListTile,
    VListTileTitle,
    VListTileAction,
    VListTileContent,
    VNavigationDrawer,
    VSlideYTransition,
    VRadioGroup,
  },
  directives: {
    Ripple,
  },
  theme: {
    primary: '#862633',
    secondary: '#29B6F6',
    accent: '#8c9eff',
    // active: '#ffe0b2',
    // anyColor: '#000',
    green: '#2C5234',
    red: '#D61E38',
    // lamons colors
    black: '#101820',
    vermilion: '#862633',
    navy: '#002B49',
    greige: '#D6D2C4',
    marigold: '#C6AA5D',
    sapphire: '#006298',
    pine: '#2C5234',
    cedar: '#5C3D31',
    apple: '#D61E38',
  },
  iconfont: 'md', // 'md' || 'mdi' || 'fa' || 'fa4'
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

Vue.mixin(registerStoreModule);
Vue.directive('click-outside', {
  priority: 700,
  bind(el, binding, vNode) {
    // Provided expression must evaluate to a function.
    if (typeof binding.value !== 'function') {
      const compName = vNode.context.name;
      let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
      if (compName) { warn += `Found in component '${compName}'`; }
      // eslint-disable-next-line no-console
      console.warn(warn);
    }
    // Define Handler and cache it on the element
    // eslint-disable-next-line prefer-destructuring
    const bubble = binding.modifiers.bubble;
    const handler = e => {
      if (bubble || !el.contains(e.target) && el !== e.target) {
        binding.value(e);
      }
    };
    el.__vueClickOutside__ = handler;

    // add Event Listeners
    document.addEventListener('click', handler);
  },

  // unbind(el, binding) {
  unbind(el) {
    // Remove Event Listeners
    document.removeEventListener('click', el.__vueClickOutside__);
    el.__vueClickOutside__ = null;
  },

  // alternative that does not work but much cleaner code...
  // bind () {
  //   let self  = this
  //   this.event = function (event) {
  //    console.log('emitting event')
  //    self.vm.$emit(self.expression,event)
  //   }
  //   this.el.addEventListener('click', this.stopProp)
  //   document.body.addEventListener('click',this.event)
  // },

  // unbind() {
  //    console.log('unbind')
  //    this.el.removeEventListener('click', this.stopProp)
  //    document.body.removeEventListener('click',this.event)
  // },
  // stopProp(event) {event.stopPropagation() }

});
