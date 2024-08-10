/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

// import dpService from './dp.service';

// const dpCache = JSON.parse(localStorage.getItem('dp'));

// default quote
// const state = dpCache || {
const state = {
  list: [
    {
      value: 'pasteAny',
      text: 'Manual PN Entry',
    },
    {
      value: 'ik_kit',
      text: 'Full Kit',
    },
    {
      value: 'ik_gasket',
      text: 'Gasket Only',
    },
    {
      value: 'ik_swSet',
      text: 'Sleeve & Washer Set',
    },
    {
      value: 'isoTube',
      text: '-- Isolation Tubes',
    },
    {
      value: 'isoSleeve',
      text: '-- Isolation Sleeve',
    },
    {
      value: 'isoWasher',
      text: '-- Isolation Washer',
    },
    {
      value: 'retWasher',
      text: '-- Back Up Washer',
    },
    {
      value: 'other',
      text: '-- Other Items',
    },
  ],
  loading: false,
  isGetPending: false,
  isUpdatePending: false,
  isForbidden: false,
};

const actions = {
  // async getSpecs({ dispatch, commit }) {
  //   const specs = [...state.specs];
  //   if (specs.length > 0) return specs;
  //   commit('SET_DP_PENDING');
  //   try {
  //     const specs = await dpService.get('specs/specs');
  //     commit('SET_SPECS', specs);
  //     return true;
  //   } catch (err) {
  //     commit('SET_DP_FAILED', err);
  //     dispatch('alert/error', err, { root: true });
  //     return false;
  //   }
  // },
};

const mutations = {
  // quote list
  // SET_DP_PENDING(state) {
  //   state.status = { loading: true };
  // },
  // SET_SPECS(state, specs) {
  //   state.status = { loaded: true };
  //   state.specs = specs;
  //   localStorage.setItem('dp', JSON.stringify(state));
  // },
  // SET_BORES(state, bores) {
  //   state.status = { loaded: true };
  //   state.bores = bores;
  //   localStorage.setItem('dp', JSON.stringify(state));
  // },
  // SET_DP_FAILED(state) {
  //   state.status = { error: true };
  //   // state.specs = [];
  // },
};

// use it only for computed values, other wise state can be used
const getters = {
  productList: state => state.list,
  // productList: state => (brandSelected, retainerSelected) => state.list.filter((doc) => {
  //   if (retainerSelected) {
  //     return (doc.retMat && doc.retMat.indexOf(retainerSelected) !== -1);
  //   } return doc.brands.indexOf(brandSelected) !== -1;
  // }),
  productTitle: state => productSelected => {
    const doc = state.list.find(doc => doc.value === productSelected);
    if (doc) return doc.text;
    return productSelected;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
