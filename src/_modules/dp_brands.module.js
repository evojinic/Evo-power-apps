/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

// import dpService from './dp.service';

// const state = dpCache || {
const state = {
  brands: [
    {
      value: 'DFS',
      text: 'Defender Fire Safe',
      maxPressure: 10000,
      maxFOD: 47.8,
      maxEOD: 48,
      kamm: true,
      defaults: {
        gType: 'F',
        facing: 'G11',
        retainer: 'S6',
        seal: 'T',
        seal2: 'M',
        sleeveM: 'G10',
        isoWasher: 'M',
        retWasher: 'ZCH',
      },
    },
    {
      value: 'DF',
      text: 'Defender',
      maxPressure: 7000,
      maxFOD: 95.5,
      maxEOD: 95.5,
      defaults: {
        gType: 'F',
        facing: 'G10',
        retainer: 'S',
        seal: 'T',
        sleeveM: 'G10',
        isoWasher: 'G10CH',
        retWasher: 'ZCH',
      },
    },
    {
      value: 'DFT',
      text: 'Defender Tandem',
      maxPressure: 10000,
      maxFOD: 95.5,
      maxEOD: 95.5,
      defaults: {
        gType: 'F',
        facing: 'G10',
        retainer: 'S',
        seal: 'T',
        seal2: 'V',
        sleeveM: 'G10',
        isoWasher: 'G10CH',
        retWasher: 'ZCH',
      },
    },
    {
      value: 'IG',
      text: 'IsoGuard',
      maxPressure: 4500,
      maxFOD: 160,
      maxEOD: 160,
      defaults: {
        gType: 'F',
        retainer: 'G10',
        seal: 'T',
        sleeveM: 'G10',
        isoWasher: 'G10CH',
        retWasher: 'ZCH',
      },
    },
    {
      value: 'IGS',
      text: 'IsoGuard Spring',
      maxPressure: 2200,
      maxFOD: 48,
      maxEOD: 48,
      defaults: {
        gType: 'F',
        retainer: 'G10',
        seal: 'T',
        sleeveM: 'G10',
        isoWasher: 'G10CH',
        retWasher: 'ZCH',
      },
    },
    {
      value: 'IGST',
      text: 'Strainer',
      maxPressure: 2200,
      maxFOD: 48,
      maxEOD: 48,
      defaults: {
        gType: 'F',
        retainer: 'CPH',
        seal: 'N',
        mesh: '',
      },
    },
    {
      value: 'IM',
      text: 'IsoMate',
      maxPressure: 1000,
      maxFOD: 47.8,
      maxEOD: 48,
      defaults: {
        gType: 'E',
        retainer: 'PHF',
        sleeveM: 'M',
        isoWasher: 'CPH',
        retWasher: 'ZCH',
      },
    },
    {
      value: 'KI',
      text: 'Kamm Pro Isolation',
      maxPressure: 10000,
      maxFOD: 47.8,
      maxEOD: 48,
      kamm: true,
      defaults: {
        gType: 'F',
        retainer: 'S6',
        seal: 'Q',
        sleeveM: 'G10',
        isoWasher: 'M',
        retWasher: 'ZCH',
      },
    },
    {
      value: 'MS',
      text: 'Matrix Sheet',
      maxPressure: 4500,
      maxFOD: 160,
      maxEOD: 160,
      defaults: {
        gType: 'E',
        retainer: 'L110',
        sleeveM: 'M',
        isoWasher: 'G10CH',
        retWasher: 'ZCH',
      },
    },
    {
      value: 'LS',
      text: 'Lamons Sheet',
      maxPressure: 4500,
      maxFOD: 160,
      maxEOD: 160,
      defaults: {
        gType: 'E',
        retainer: 'L441',
        sleeveM: 'M',
        isoWasher: 'G10CH',
        retWasher: 'ZCH',
      },
    },
    {
      value: 'DRG',
      text: 'Defender Rescue Gasket',
      maxPressure: 7000,
      maxFOD: 47.8,
      maxEOD: 48,
      kamm: true,
      defaults: {
        gType: 'F',
        retainer: 'S6',
        seal: '2',
        seal2: '4',
      },
    },
    {
      value: 'KITS',
      placeHolder: true,
      text: 'Sleeve & Washer Set',
      defaults: {
        sleeveM: 'G10',
        isoWasher: 'G10CH',
        retWasher: 'ZCH',
      },
    },
    {
      value: 'PW',
      placeHolder: true,
      text: 'Washer',
      defaults: {},
    },
    {
      value: 'PT',
      placeHolder: true,
      text: 'Isolation Tube',
      defaults: {},
    },
  ],
  loading: false,
  isGetPending: false,
  isUpdatePending: false,
  isForbidden: false,
};

const actions = {
  // async getBores({ dispatch, commit }) {
  //   const bores = [...state.bores];
  //   if (bores.length > 0) return bores;
  //   commit('SET_DP_PENDING');
  //   try {
  //     const bores = await dpService.get('specs/bores');
  //     commit('SET_BORES', bores);
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
  brandList: state => state.brands.filter(b => !b.placeHolder),
  brandTitle: state => brandSelected => {
    if (brandSelected === 'PW') return 'Washer';
    if (brandSelected === 'MW') return 'Manufactured Washer';
    if (brandSelected === 'isoWasher') return 'Isolation Washer';
    if (brandSelected === 'retWasher') return 'Retaining/Back Up Washer';
    if (brandSelected === 'PT') return 'Isolation Tube';
    const b = state.brands.find(brand => brand.value === brandSelected);
    if (b) return b.text;
    return brandSelected;
  },
  gTypeDefault: state => brandSelected => {
    const b = state.brands.find(doc => doc.value === brandSelected);
    if (b) return b.defaults.gType;
    return '';
  },
  facingDefault: state => brandSelected => {
    const b = state.brands.find(doc => doc.value === brandSelected);
    if (b) return b.defaults.facing;
    return '';
  },
  retainerDefault: state => brandSelected => {
    const b = state.brands.find(doc => doc.value === brandSelected);
    if (b) return b.defaults.retainer;
    return '';
  },
  sealDefault: state => brandSelected => {
    const b = state.brands.find(doc => doc.value === brandSelected);
    if (b) return b.defaults.seal;
    return '';
  },
  sealOuterDefault: state => brandSelected => {
    const b = state.brands.find(doc => doc.value === brandSelected);
    if (b) return b.defaults.seal2;
    return '';
  },
  hasKamm: state => brandSelected => {
    const b = state.brands.find(doc => doc.value === brandSelected);
    if (b) return b.kamm;
    return '';
  },
  sleeveDefault: state => brandSelected => {
    const b = state.brands.find(doc => doc.value === brandSelected);
    if (b) return b.defaults.sleeveM;
    return '';
  },
  isoWasherDefault: state => brandSelected => {
    const b = state.brands.find(doc => doc.value === brandSelected);
    if (b) return b.defaults.isoWasher;
    return '';
  },
  retWasherDefault: state => brandSelected => {
    const b = state.brands.find(doc => doc.value === brandSelected);
    if (b) return b.defaults.retWasher;
    return '';
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
