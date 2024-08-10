/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

// import dp from './dp.service';

// const dpCache = JSON.parse(localStorage.getItem('dp'));

// default quote
// const state = dpCache || {
const state = {
  list: [
    {
      value: 'ZCH',
      text: 'Zinc Plated Steel',
      purchased: true,
      manufactured: false,
      psOnly: true,
    },
    {
      value: 'Z',
      text: 'Zinc Plated Steel Domestic',
      purchased: true,
      manufactured: true,
      psOnly: false,
    },
    {
      value: 'HC',
      text: 'Coated Harden Steel',
      purchased: true,
      manufactured: false,
    },
    {
      value: 'C316L',
      text: 'Coated 316 Stainless',
      purchased: true,
      manufactured: true,
    },
    // {
    //   value: 'BHC',
    //   text: 'Harden Coated',
    //   purchased: true,
    //   manufactured: false,
    // },
    {
      value: 'S304',
      text: '304 Stainless',
      purchased: true,
      manufactured: true,
    },
    {
      value: '316L',
      text: '316 Stainless',
      purchased: true,
      manufactured: true,
    },
    {
      value: 'I625',
      text: 'Inconel 625',
      purchased: true,
      manufactured: true,
    },
    {
      value: 'I825',
      text: 'Inconel 825',
      purchased: true,
      manufactured: true,
    },
    {
      value: 'SD2507',
      text: 'Super Duplex 2507',
      purchased: true,
      manufactured: true,
    },
    {
      value: 'UD2205',
      text: 'Super Duplex 2205',
      purchased: true,
      manufactured: true,
    },
    {
      value: 'NA',
      text: 'No Back Up Washers',
      purchased: false,
      manufactured: false,
    },
  ],
  isGetPending: false,
  isForbidden: false,
};

const actions = {
  // async getSpecs({ dispatch, commit }) {
  //   const specs = [...state.specs];
  //   if (specs.length > 0) return specs;
  //   commit('SET_DP_PENDING');
  //   try {
  //     const specs = await dp.get('specs/specs');
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
  retWasherList: state => state.list,
  retWasherPSList: state => state.list.filter(w => w.psOnly !== false),
  retPWasherList: state => state.list.filter(w => w.psOnly !== false && w.purchased),
  retMWasherList: state => state.list.filter(w => w.psOnly !== false && w.manufactured),
  // retWasherList: state => (brandSelected, retainerSelected) => state.retWashers.filter((doc) => {
  //   if (retainerSelected) {
  //     return (doc.retMat && doc.retMat.indexOf(retainerSelected) !== -1);
  //   } return doc.brands.indexOf(brandSelected) !== -1;
  // }),
  retWasherTitle: state => retWasherSelected => {
    const doc = state.list.find(doc => doc.value === retWasherSelected);
    if (doc) return doc.text;
    return retWasherSelected;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
