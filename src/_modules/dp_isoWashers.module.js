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
      value: 'G10CH',
      text: 'G10',
      purchased: true,
      manufactured: true,
    },
    {
      value: 'G10D',
      text: 'G10 Domestic',
      purchased: true,
      manufactured: true,
    },
    {
      value: 'G11',
      text: 'G11',
      purchased: true,
      manufactured: true,
    },
    {
      value: 'CPH',
      text: 'PHENOLIC',
      purchased: true,
      manufactured: true,
    },
    {
      value: 'M',
      text: 'MICA',
      purchased: true,
      manufactured: true,
    },
    // {
    //   value: 'MC',
    //   text: 'Coated MICA',
    //   purchased: true,
    //   manufactured: true,
    // },
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
    //   manufactured: true,
    // },
    {
      value: 'G3',
      text: 'G3',
      purchased: true,
      manufactured: true,
    },
    // {
    //   value: 'G7',
    //   text: 'G7',
    //   purchased: true,
    //   manufactured: true,
    // },
    {
      value: 'NA',
      text: 'No Iso. Washers',
      purchased: false,
      manufactured: false,
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
  isoWasherList: state => state.list,
  isoPWasherList: state => state.list.filter(w => w.purchased),
  isoMWasherList: state => state.list.filter(w => w.manufactured),
  // isoWasherList: state => (brandSelected, retainerSelected) => state.list.filter((doc) => {
  //   if (retainerSelected) {
  //     return (doc.retMat && doc.retMat.indexOf(retainerSelected) !== -1);
  //   } return doc.brands.indexOf(brandSelected) !== -1;
  // }),
  isoWasherTitle: state => isoWasherSelected => {
    const doc = state.list.find(doc => doc.value === isoWasherSelected);
    if (doc) return doc.text;
    return isoWasherSelected;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
