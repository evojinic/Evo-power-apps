/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

// import dp from './dp.service';

// const dpCache = JSON.parse(localStorage.getItem('dp'));

// default quote
// const state = dpCache || {
const state = {
  seals: [
    {
      value: 'E',
      text: 'Pure EPDM (NSF 61 cert.)',
      brands: [],
      inner: true,
      retMat: ['G10PW', 'PWQ'],
    },
    {
      value: 'TM',
      text: 'PTFE Matrix (WRAS cert.)',
      brands: [],
      inner: true,
      retMat: ['G10PW', 'PWQ'],
    },
    {
      value: 'T',
      text: 'PTFE',
      brands: ['IG'],
      inner: true,
    },
    {
      value: 'N',
      text: 'Nitrile',
      brands: ['IG', 'KI'],
      inner: true,
    },
    {
      value: 'V',
      text: 'Viton',
      brands: ['IG', 'KI'],
      inner: true,
    },
    {
      value: 'E',
      text: 'Pure EPDM',
      brands: ['IG', 'KI'],
      inner: true,
    },
    {
      value: null,
      text: 'no seal',
      brands: ['IG'],
      inner: true,
      retMat: ['G10PW', 'PWQ'],
    },
    {
      value: 'T',
      text: 'PTFE',
      brands: ['IGST'],
      inner: true,
      retMat: ['PH', 'G10', 'G11'],
    },
    {
      value: 'N',
      text: 'Nitrile',
      brands: ['IGST'],
      inner: true,
      retMat: ['PH', 'G10', 'G11'],
    },
    {
      value: 'V',
      text: 'Viton',
      brands: ['IGST'],
      inner: true,
      retMat: ['PH', 'G10', 'G11'],
    },
    {
      value: 'E',
      text: 'Pure EPDM',
      brands: ['IGST'],
      inner: true,
      retMat: ['PH', 'G10', 'G11'],
    },
    {
      value: null,
      text: 'no seal',
      brands: ['IGST'],
      inner: true,
      retMat: ['L441', 'CP'],
    },
    {
      value: 'T1',
      text: 'PTFE (seal on one side)',
      brands: ['IG'],
      inner: true,
    },
    {
      value: 'N1',
      text: 'Nitrile (seal on one side)',
      brands: ['IG'],
      inner: true,
    },
    {
      value: 'V1',
      text: 'Viton (seal on one side)',
      brands: ['IG'],
      inner: true,
    },
    {
      value: 'T',
      text: 'Spring Energized PTFE',
      brands: ['DF', 'DFT', 'IGS'],
      inner: true,
    },
    {
      value: '8',
      text: 'Inc. 825 Spring Energized PTFE',
      brands: ['DF', 'DFT', 'IGS'],
      inner: true,
    },
    {
      value: 'T',
      text: 'Spring Energized PTFE',
      brands: ['DFT'],
      outer: true,
    },
    {
      value: 'V',
      text: 'Viton O-Ring',
      brands: ['DF', 'DFT', 'IGS'],
      inner: true,
    },
    {
      value: 'V',
      text: 'Viton O-Ring',
      brands: ['DFT'],
      outer: true,
    },
    {
      value: 'Q',
      text: 'KLINGER® Quantum',
      brands: ['KI'],
      inner: true,
    },
    // {
    //   value: 'TP',
    //   text: 'THERMa-PUR®',
    //   brands: ['KI'],
    //   inner: true,
    // },
    {
      value: 'T',
      text: 'Lamons PTFE Matrix 110',
      brands: ['DFS', 'KI'],
      inner: true,
    },
    {
      value: 'M',
      text: 'Mica',
      brands: ['DFS'],
      outer: true,
    },
    {
      value: null,
      text: 'PTFE Only ( !not fire safe! )',
      brands: ['DFS'],
      outer: true,
    },
    {
      value: '2',
      text: 'Expanded PTFE',
      brands: ['DRG'],
      inner: true,
    },
    {
      value: '4',
      text: 'Lamons 104',
      brands: ['DRG'],
      outer: true,
    },
    {
      value: 'GX',
      text: 'Graphite',
      brands: ['DRG'],
      outer: true,
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

// use it only for computed values, other wise state can be used
const getters = {

  sealList: state => (brandSelected, retainerSelected) => state.seals.filter(doc => {
    if (retainerSelected) {
      return doc.retMat && doc.retMat.indexOf(retainerSelected) !== -1;
    } return doc.brands.indexOf(brandSelected) !== -1;
  }),
  sealTitle: state => (brandSelected, sealSelected) => {
    const seal = state.seals.find(doc =>
      doc.inner === true &&
      doc.value === sealSelected &&
      doc.brands.indexOf(brandSelected) !== -1
    );
    if (seal) return seal.text;
    return sealSelected;
  },

  sealOuterList: state => brandSelected => state.seals.filter(seal =>
    seal.outer === true &&
    seal.brands.indexOf(brandSelected) !== -1,
  ),
  sealOuterTitle: state => (brandSelected, sealSelected) => {
    const seal = state.seals.find(doc =>
      doc.outer === true &&
      doc.brands.indexOf(brandSelected) !== -1 &&
      doc.value === sealSelected
    );
    if (seal) return seal.text;
    return sealSelected;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
