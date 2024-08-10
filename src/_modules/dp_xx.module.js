/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

// import dpService from './dp.service';

// const state = dpCache || {
const state = {
  options: [
    {
      value: 'kValue',
      text: 'Bolt Friction Factor',
      input: {
        type: 'number',
        min: '0.10',
        max: '0.24',
        step: '0.01',
        default: '0.19',
      },
      product: ['ik_kit', 'ik_gasket']
    },
    {
      value: 'B_type',
      text: 'Bolt Type',
      input: {
        type: 'select',
        list: [
          {
            value: 'B5',
            text: 'B5'
          },
          {
            value: 'B7',
            text: 'B7'
          },
          {
            value: 'B8',
            text: 'B8 class 1'
          },
          {
            value: 'B8M',
            text: 'B8M class 1'
          },
          {
            value: 'B82',
            text: 'B8 class 2'
          },
          {
            value: 'B8M2',
            text: 'B8M class 2'
          },
          {
            value: 'A307',
            text: 'A307B 36ksi'
          },
        ],
      },
      product: ['ik_kit', 'ik_gasket']
    },
    {
      value: 'unbranded',
      text: 'unbranded (no LAMONS or BRAND)',
      priority: 0.01,
      // input: {
      //   type: 'textarea',
      //   rows: 3,
      // },
      // product: []
      multiple: true,
    },
    {
      value: 'noUSA',
      text: 'no made in USA call out',
      priority: 0.02,
      multiple: true,
    },
    {
      value: 'noPN',
      text: 'no part number(s)',
      priority: 0.03,
      multiple: true,
    },
    {
      value: 'branding',
      text: 'Custom Branding',
      priority: 3.31,
      // product: ['ik_kit', 'ik_swSet'],
      input: {
        type: 'string',
      },
      required: '',
    },
    {
      value: 'labelPerGasket',
      text: 'Label for each gasket',
      priority: 1.01,
      product: ['ik_gasket'],
      multiple: true,
    },
    {
      value: 'label',
      text: 'Additional Label Text',
      priority: 1.02,
      input: {
        type: 'textarea',
        rows: 3,
      },
      // product: []
      multiple: true,
    },
    {
      value: 'laser',
      text: 'Additional Laser @ 3\'O Clock',
      priority: 1.03,
      product: ['ik_kit', 'ik_gasket'],
      input: {
        type: 'textarea',
        rows: 3,
      },
      multiple: true,
    },
    // {
    //   value: 'hasIGT',
    //   text: 'Intelligent Gasket Tagging (IGT)',
    //   priority: 1.03,
    //   // input: {
    //   //   type: 'textarea',
    //   //   rows: 3,
    //   // },
    //   // product: []
    //   multiple: true,
    // },
    // {
    //   value: 'noRTJ',
    //   text: 'no RTJ consideration',
    //   priority: 1.04,
    //   // input: {
    //   //   type: 'textarea',
    //   //   rows: 3,
    //   // },
    //   // product: []
    //   multiple: true,
    // },
    {
      value: 'flange1Face',
      text: 'Flange Face',
      priority: 2.01,
      input: {
        type: 'select',
        list: [
          {
            value: '',
            text: 'Show Both'
          },
          {
            value: 'RF',
            text: 'Raised Face (RF)'
          },
          {
            value: 'RTJ',
            text: 'Ring Type Joint (RTJ)'
          },
          {
            value: 'FF',
            text: 'Full Face (FF)'
          },
        ],
      },
      product: ['ik_kit', 'ik_gasket'],
    },
    // {
    //   value: 'flange2Face',
    //   text: 'Flange 2 Face (otherwise same as 1)',
    //   priority: 2.01,
    //   input: {
    //     type: 'select',
    //     list: [
    //       {
    //         value: 'RF',
    //         text: 'Raised Face (RF)'
    //       },
    //       {
    //         value: 'RTJ',
    //         text: 'Ring Type Joint (RTJ)'
    //       },
    //       {
    //         value: 'FF',
    //         text: 'Full Face (FF)'
    //       },
    //     ],
    //   },
    //   product: ['ik_kit', 'ik_gasket'],
    //   required: 'flange1Face',
    // },
    {
      value: 'spacerThk',
      text: 'Spacer Thickness',
      priority: 2.11,
      product: ['ik_kit', 'ik_swSet'],
      input: {
        type: 'number',
        min: '0.02',
        max: '50',
        step: '0.01',
      },
    },
    {
      value: 'valveThk',
      text: 'Valve Thickness',
      priority: 2.21,
      product: ['ik_kit', 'ik_swSet'],
      input: {
        type: 'number',
        min: '0.02',
        max: '50',
        step: '0.01',
      },
    },
    {
      value: 'gasket2Thk',
      text: '2nd Gasket Thickness',
      priority: 2.31,
      product: ['ik_kit', 'ik_swSet'],
      input: {
        type: 'number',
        min: '0.02',
        max: '1',
        step: '0.01',
      },
    },
    {
      value: 'dbl',
      text: 'Double or Single Set of Washers',
      priority: 3.01,
      product: ['ik_kit', 'ik_swSet'],
      input: {
        type: 'radio',
      },
    },
    {
      value: 'sleeveL',
      text: 'Sleeve Length',
      priority: 3.02,
      product: ['ik_kit', 'ik_swSet'],
      input: {
        type: 'number',
        min: '0.25',
        max: '72',
        step: '0.03125',
      },
    },
    {
      value: 'sleeveQ',
      text: 'Sleeve Qty',
      priority: 3.03,
      product: ['ik_kit', 'ik_swSet'],
      input: {
        type: 'string',
        // type: 'number',
        // min: '1',
        // step: '1',
      },
    },
    {
      value: 'sleeveL2',
      text: 'Sleeve 2 Length',
      priority: 3.07,
      product: ['ik_kit', 'ik_swSet'],
      input: {
        type: 'number',
        min: '0.25',
        max: '72',
        step: '0.03125',
      },
      required: 'sleeveL',
    },
    {
      value: 'sleeveQ2',
      text: 'Sleeve 2 Qty',
      priority: 3.08,
      product: ['ik_kit', 'ik_swSet'],
      input: {
        type: 'string',
        // type: 'number',
        // min: '1',
        // step: '1',
      },
      required: 'sleeveL2',
    },
    {
      value: 'sleeveL3',
      text: 'Sleeve 3 Length',
      priority: 3.11,
      product: ['ik_kit', 'ik_swSet'],
      input: {
        type: 'number',
        min: '0.25',
        max: '72',
        step: '0.03125',
      },
      required: 'sleeveL2',
    },
    {
      value: 'sleeveQ3',
      text: 'Sleeve 3 Qty',
      priority: 3.12,
      product: ['ik_kit', 'ik_swSet'],
      input: {
        type: 'string',
        // type: 'number',
        // min: '1',
        // step: '1',
      },
      required: 'sleeveL3',
    },
    {
      value: 'isoWasherQ',
      text: 'Isolation Washer Qty',
      priority: 3.21,
      product: ['ik_kit', 'ik_swSet'],
      input: {
        type: 'string',
        // min: '1',
        // step: '1',
      },
      required: '',
    },
    {
      value: 'retWasherQ',
      text: 'Backup Washer Qty',
      priority: 3.31,
      product: ['ik_kit', 'ik_swSet'],
      input: {
        type: 'string',
        // min: '1',
        // step: '1',
      },
      required: '',
    },
    {
      value: 'hasLube',
      text: 'Has Dose Unit/Lubricant',
      priority: 3.31,
      product: ['ik_gasket', 'ik_kit', 'ik_swSet'],
      input: {
        type: 'boolean',
      },
      required: '',
    },
    // {
    //   value: 'gasketQty',
    //   text: 'Gasket Qty',
    //   priority: 3.51,
    //   product: ['ik_kit'],
    //   input: {
    //     type: 'number',
    //     min: '1',
    //     step: '1',
    //   },
    //   required: '',
    // },
    // {
    //   value: 'spacerThk',
    //   text: 'Spacer Thickness',
    //   priority: 3.51,
    //   product: ['ik_kit', 'ik_swSet'],
    //   input: {
    //     type: 'number',
    //     // min: '1',
    //     step: '0.01',
    //   },
    //   required: '',
    // },
  ],
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

// TODO find a better way to get defaults since it reuses the same code, to find option info
// use it only for computed values, other wise state can be used
const getters = {
  option: state => option => state.options.find(opt => opt.value === option) || { value: option, text: option },
  optionsForProduct: state => (product, selected) => state.options.filter(opt =>
    (opt.required ? selected.indexOf(opt.required) !== -1 : true) &&
      (opt.product ? opt.product.indexOf(product) !== -1 : true)
  ),
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
