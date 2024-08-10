/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

// import dp from './dp.service';

// const dpCache = JSON.parse(localStorage.getItem('dp'));

// default quote
// const state = dpCache || {
const state = {
  sleeves: [
    {
      value: 'G10',
      text: 'GRE G10',
    },
    {
      value: 'G11',
      text: 'GRE G11',
    },
    {
      value: 'M',
      text: 'MYLAR',
    },
    {
      value: 'P',
      text: 'POLY',
    },
    {
      value: 'MM',
      text: 'MICA',
    },
    {
      value: 'N',
      text: 'NOMEX',
    },
    // {
    //   value: 'G7',
    //   text: 'G7',
    //   retMat: ['G7'],
    // },
    {
      value: 'NA',
      text: 'No Iso. Sleeves',
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

// TODO find a better way to get defaults since it reuses the same code, to find brand info
// use it only for computed values, other wise state can be used
const getters = {
  sleeveList: state => state.sleeves,
  sleeveListReq: state => state.sleeves.slice(0, -1), // removes last option of no sleeve
  sleeveTitle: state => sleeveSelected => {
    const doc = state.sleeves.find(doc => doc.value === sleeveSelected);
    if (doc) return doc.text;
    return sleeveSelected;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
