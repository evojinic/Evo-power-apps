/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

import dpService from './dp.service';
import itemsService from './item.service';

import products from './dp_products.module';
import brands from './dp_brands.module';
import seals from './dp_seals.module';
import sleeves from './dp_sleeves.module';
import retWashers from './dp_retWashers.module';
import isoWashers from './dp_isoWashers.module';
import xx from './dp_xx.module';

const dateTime = due => {
  const dO = new Date(due);
  // date
  const y = dO.getFullYear();
  let m = dO.getMonth() + 1;
  if (m < 10) m = `0${m}`;
  let d = dO.getDate();
  if (d < 10) d = `0${d}`;
  // time
  let min = dO.getMinutes();
  if (min < 10) min = `0${min}`;
  let h = dO.getHours();
  if (h < 10) h = `0${h}`;
  return { date: `${y}-${m}-${d}`, time: `${h}:${min}` };
};

const dpCache = JSON.parse(localStorage.getItem('dp')) || {};
const dpList = JSON.parse(localStorage.getItem('dpList')) || {};
const state = {
  selected: {
    xx: {},
  },
  disable: {},
  visible: {},
  filters: { f_swSet: '', edit: 0 },
  dims: {},
  edits: [],
  editParts: [],
  status: {
    isPendingSpecs: false,
    isPendingBores: false,
  },
  specs: dpCache.specs || [],
  bores: dpCache.bores || [],
  gTypes: [
    {
      value: 'F',
      text: 'Ring Type (F)',
      brands: ['all'],
      exclude: [],
    },
    {
      value: 'E',
      text: 'Full Face (E)',
      brands: ['all'],
      exclude: ['KI', 'DRG'],
    },
  ],
  facings: [
    {
      value: 'G10',
      text: 'GRE G10',
      brands: ['DF', 'DFT', 'DFS'],
    },
    {
      value: 'G11',
      text: 'GRE G11',
      brands: ['DF', 'DFT', 'DFS'],
    },
    {
      value: 'L110',
      text: 'Lamons PTFE Matrix 110',
      brands: ['DFS'],
    },
  ],
  retainers: [
    {
      value: 'S6',
      text: '316SS',
      brands: ['KI', 'DFS', 'DRG'],
    },
    {
      value: 'CS',
      text: 'Carbon Steel',
      brands: ['DRG'],
    },
    {
      value: 'S',
      text: '316SS',
      brands: ['DF', 'DFT'],
    },
    {
      value: 'I8',
      text: 'Alloy 800/Alloy 825 ',
      brands: ['DF', 'DFT', 'DFS', 'KI'],
    },
    {
      value: 'I6',
      text: 'Alloy 600/Alloy 625',
      brands: ['DF', 'DFT', 'DFS', 'KI'],
    },
    {
      value: 'SD',
      text: 'Super Duplex - 2507 (SD)',
      brands: ['DF', 'DFT', 'DFS', 'KI'],
    },
    {
      value: 'UD',
      text: 'Super Duplex - 2205 (UD)',
      brands: ['DF', 'DFT', 'DFS', 'KI'],
    },
    {
      value: 'N0',
      text: 'Monel 400',
      brands: ['DFS', 'KI', 'DRG'],
    },
    {
      value: 'G10',
      text: 'GRE G10',
      brands: ['IG', 'IGS'],
    },
    {
      value: 'PH',
      text: 'Phenolic',
      brands: ['IG'],
    },
    {
      value: 'PH',
      text: 'Phenolic (0.25)',
      brands: ['IGST'],
    },
    {
      value: 'CP',
      text: 'Corrugated Profile Matrix',
      brands: ['IGST'],
    },
    {
      value: 'G10',
      text: 'GRE G10 (0.25)',
      brands: ['IGST'],
    },
    {
      value: 'L441',
      text: 'Lamons 441 (0.25)',
      brands: ['IGST'],
    },
    {
      value: 'L104',
      text: 'Lamons 104 (0.25)',
      brands: ['IGST'],
    },
    {
      value: 'G10PW',
      text: 'Potable Water G10',
      brands: ['IG'],
    },
    {
      value: 'PWQ',
      text: 'Potable Water G10 (0.25)',
      brands: ['IG'],
    },
    {
      value: 'G11',
      text: 'G11',
      brands: ['IG', 'IGS'],
    },
    {
      value: 'G7',
      text: 'G7',
      brands: ['IG', 'IGS'],
    },
    {
      value: 'PHF',
      text: 'Nitrile Faced Phenolic',
      brands: ['IM'],
    },
    {
      value: 'L100',
      text: 'Lamons PTFE Matrix 100 (NSF)',
      brands: ['MS'],
    },
    {
      value: 'L110',
      text: 'Lamons PTFE Matrix 110 (NSF)',
      brands: ['MS'],
    },
    {
      value: 'L104',
      text: 'Lamons PTFE Matrix 104 (NSF)',
      brands: ['MS'],
    },
    {
      value: 'L420',
      text: 'Lamons 420',
      brands: ['LS'],
    },
    {
      value: 'L441',
      text: 'Lamons 441',
      brands: ['LS'],
    },
    {
      value: 'L443',
      text: 'Lamons 443',
      brands: ['LS'],
    },
    {
      value: 'CP',
      text: 'Corrugated Profile Matrix',
      brands: ['MS'],
    },
  ],
  meshes: [
    {
      value: '20',
      text: '20 gage',
    },
    {
      value: '40',
      text: '40 gage',
    },
    {
      value: '60',
      text: '60 gage',
    },
    {
      value: '100',
      text: '100 gage',
    },
  ],
  rmvCache: {},
  dpList: dpList || {},
};

const actions = {
  async getSpecs({ dispatch, commit }) {
    const specs = state.specs || [];
    if (specs.length > 0) return specs;
    commit('ADD_STATUS_KEY', 'isPendingSpecs');
    try {
      const specs = await dpService.get('specs/specs');
      commit('SET_SPECS', specs);
      return true;
    }
    catch (err) {
      dispatch('alert/error', err, { root: true });
      commit('REMOVE_STATUS_KEY', 'isPendingSpecs');
      return false;
    }
  },
  async getBores({ dispatch, commit }) {
    const bores = state.bores || [];
    if (bores.length > 0) return bores;
    commit('ADD_STATUS_KEY', 'isPendingBores');
    try {
      const bores = await dpService.get('specs/bores');
      commit('SET_BORES', bores);
      return true;
    }
    catch (err) {
      dispatch('alert/error', err, { root: true });
      commit('REMOVE_STATUS_KEY', 'isPendingBores');
      return false;
    }
  },
  async getOptions({ dispatch, commit, state }, name) {
    const dp = state.dpList[name] || {};
    if (!dp.options || dp.options.length === 0) {
      commit('ADD_STATUS_KEY', name);
      try {
        const options = await itemsService.getOptionsList(name);
        commit('SET_DP', { name, options });
      }
      catch (err) {
        dispatch('alert/error', err, { root: true });
      }
      commit('REMOVE_STATUS_KEY', name);
    }
  },
  clearForm({ commit }) { commit('CLEAR'); },
  addDp({ commit }, payload) { commit('ADD_DP', payload); },
  rmvDp({ commit }, payload) { commit('RMV_DP', payload); },
  addKey({ commit }, payload) { commit('ADD_KEY', payload); },
  rmvKey({ commit }, payload) { commit('RMV_KEY', payload); },
  setEdit({ commit }, payload) { commit('SET_EDIT', payload); },
  setSelectKey({ commit }, payload) { commit('SET_SELECT', payload); },
};

const mutations = {
  ADD_STATUS_KEY(state, key) {
    state.status[key] = true;
    state.status = { ...state.status };
  },
  REMOVE_STATUS_KEY(state, key) {
    state.status[key] = false;
    state.status = { ...state.status };
  },
  SET_SPECS(state, specs) {
    state.status = { isPendingSpecs: false };
    state.specs = specs;
    localStorage.setItem('dp', JSON.stringify(state));
  },
  SET_BORES(state, bores) {
    state.status = { isPendingBores: false };
    state.bores = bores;
    localStorage.setItem('dp', JSON.stringify(state));
  },
  SET_DP(state, { name, options }) {
    const dpList = { ...state.dpList };
    dpList[name] = options;
    state.dpList = dpList;
    // localStorage.setItem('dpList', JSON.stringify(state));
  },
  ADD_DP(state, dp) {
    const dropDown = state.dpList[dp];
    // console.log(`%c+++ dp: %c${dp}`, 'color: green',  'color: lightblue')
    for (const { oKey, fKey, default: dv } of dropDown.options) {
      if (fKey) state.filters[oKey] = dv;
      if (oKey) state.selected[oKey] = state.rmvCache[oKey] || dv;
      // if (xxKey) {
      //   delete state.selected.xx[xxKey];
      // }
    }
    state.filters = { ...state.filters };
    state.selected = { ...state.selected };
  },
  CLEAR(state) {
    state.selected = { xx: {}, qty: 1 };
    state.disable = {};
    state.visible = {};
    state.filters = { f_swSet: '', edit: 0 };
  },
  RMV_DP(state, dp) {
    const dropDown = state.dpList[dp];
    // console.log(`%c--- dp: %c${dp}`, 'color: red',  'color: lightblue')
    for (const { oKey } of dropDown.options) {
      // if (fKey) {
      //   delete state.filters[fKey];
      //   state.filters = Object.assign({}, state.filters);
      // }
      if (oKey) {
        delete state.selected[oKey];
        // delete state.disable[oKey];
        // state.disable = Object.assign({}, state.disable);
      }
      // if (xxKey) {
      //   delete state.selected.xx[xxKey];
      // }
    }
    state.selected = { ...state.selected };
  },
  SET_EDIT(state, { edits, editParts }) {
    state.edits = edits;
    state.editParts = editParts;
    const disable = {};
    const { selected, filters } = state;
    // console.log('edit parts', state.editParts)
    // initializeEditLine
    filters.editLen = edits.length;
    const part = editParts[0];
    if (edits.length === 0) {
      state.disable = {};
      filters.edit = false;
    }
    else if (edits.length > 0) {
      filters.edit = true;
      if (part.due) {
        disable.job = true;
        disable.qty = true;
        disable.f_swSet = true;
        disable.f_apl = true;
      }
      const itemD = part.d;
      const query = part.error && typeof part.pn === 'object' ? part.pn : part.q;
      const itemKeys = Object.keys(query);
      // set selection
      for (const key of itemKeys) {
        // console.log('selected ', key, query[key]);
        if (key === 'sleeveL' && query.sleeveL && query.product !== 'isoSleeve') {
          if ((itemD && itemD.sleeve ? itemD.sleeve.stdLength : 0) !== query.sleeveL) {
            if (!selected.xx) selected.xx = { sleeveL: query.sleeveL };
            else if (selected.xx) selected.xx.sleeveL = query.sleeveL;
          }
        }
        else if (key === 'nSize' && query[key]) {
          selected.nSize = [query[key].toString()];
          filters.size = query[key].toString();
        }
        else selected[key] = query[key];
        if (key === 'seal2') filters[key] = true;
        if (part.due) {
          if (key !== 'xx') disable[key] = true;
          if (key === 'sleeveM' && query.sleeveM === 'XX') disable[key] = false;
          if (key === 'isoWasher' && query.isoWasher === 'XX') disable[key] = false;
          if (key === 'retWasher' && query.retWasher === 'XX') disable[key] = false;
        }
      }

      if (selected.customBore === true) {
        selected.customBore = selected.bore;
        selected.bore = 'User Defined';
      }

      if (selected.spec) filters.spec = selected.spec;
      if (selected.pClass) filters.pClass = selected.pClass;

      if (selected.spec === 'AWWA' && !selected.customBore) {
        selected.pClass = selected.bore;
        selected.bore = selected.pClass;
        filters.pClass = selected.bore;
      }

      selected.qty = part.qty;
      if (part.job) selected.job = part.job;
      if (part.due) {
        const dt = dateTime(part.due);
        selected.dueDate = dt.date;
        selected.dueTime = dt.time;
      }
      // console.log(part.q.xx)
      selected.xx = { ...query.xx };
      // console.log(selected.xx);

      // ...? temp overwrite ?... i think the logic should be based on these values and not master style
      if (query.product === 'gasket_sw') {
        const styles = state.dpList.gasket_sw.options.find(o => o.oKey === 'style');
        const style = styles.list.find(s => s.value === selected.style);
        // console.log(style)
        if (style.irStyle) selected.irStyle = style.irStyle;
        if (style.orStyle) selected.orStyle = style.orStyle;
        if (style.winding) selected.winding = style.winding;
      }

      // filter update
      filters.f_apl = '';
      filters.f_product = '';
      if (selected.dbl === true) filters.f_swSet = 'DBL';
      else if (selected.dbl === false) filters.f_swSet = 'SNL';
      else if (selected.dbl === undefined) filters.f_swSet = '';
      if (['ik_kit', 'ik_swSet'].indexOf(selected.product) === -1) filters.f_swSet = '';

      if (!part.q || !part.q.product) {
        selected.product = 'custom';
        selected.desc = part.q ? part.q.brand || '' : part.desc || '';
        disable.desc = true;
        selected.pn = part.pn;
        selected.up = part.up;
        disable.product = true;
        disable.pn = true;
        disable.up = true;
      }
    }

    const disableVal = {};
    if (edits.length > 1) {
      // update line number to be shown on the button
      for (const part of editParts) {
        const query = part.q;
        const qKeys = Object.keys(query);
        for (const qk of qKeys) {
          if (part.due && ['xx'].indexOf(qk) === -1) disable[qk] = true;
          else if (disable[qk] === undefined) {
            disable[qk] = false;
            disableVal[qk] = query[qk];
          }
          else if (!disableVal[qk]) disable[qk] = true;
          else if (disableVal[qk] !== query[qk]) disable[qk] = true;
        }

        if (part.due) {
          const dt = dateTime(part.due);
          selected.dueDate = dt.date;
          selected.dueTime = dt.time;
        }

        if (query.customBore === true) {
          query.customBore = query.bore;
          query.bore = 'User Defined';
        }
      }

      // // always allow due date change
      disable.dueDate = false;
      // // custom pn stuff
      // state.disable.pn = true;
      // state.disable.desc = true;
      // state.disable.up = true;
      // // other default disables
      disable.product = true;
      disable.spec = true;
      disable.qty = true;
      disable.xx = true;
      disable.f_swSet = true;
      disable.f_apl = true;
      // state.disable.sleeveL = true;
      // // job data
      // state.disable.job = true;
      // state.disable.dueTime = true;
      // state.disable.purchased = true;
    }

    state.disable = { ...disable };
    state.filters = { ...filters };
    state.selected = { ...selected };
    // console.log('disabled:', disable)
    // console.log({ ...state.selected })
  },
  SET_SELECT(state, { oKey, val, xxKey, toggle, fKey, fVal, default: dv, overwrite }) {
    // console.log(`>>> ${[oKey, fKey, xxKey]}`, { val, toggle, dv, overwrite })
    const { selected, filters } = state;
    const { xx } = state.selected;

    if (state.editParts.length < 2 && overwrite) {
      for (const { fKey, oKey, xxKey, val, ifKey, ifVal } of overwrite) {
        if (ifKey && selected[ifKey] !== ifVal) continue;
        if (selected[oKey] === undefined && val) {
          state.rmvCache[oKey] = val;
          continue;
        }
        if (fKey) filters[fKey] = val;
        if (oKey) selected[oKey] = val;
        if (xxKey) xx[xxKey] = val;
      }
    }

    if (!selected.seal) {
      if (selected.brand === 'IG') {
        if (selected.retMat === 'G10PW' || selected.retMat === 'PWQ') {
          selected.seal = 'E';
          selected.gType = 'E';
        }
        else if (selected.retMat === 'PH') {
          selected.seal = 'N';
        }
      }
      if (selected.brand === 'IGST') {
        if (selected.retMat === 'L441') delete selected.seal;
        else if (selected.retMat === 'L104') delete selected.seal;
        else if (selected.retMat === 'CP') delete selected.seal;
        else selected.seal = 'N';
      }
    }

    // xx key
    if (xxKey) {
      if (toggle !== undefined) {
        if (toggle) xx[xxKey] = dv || '';
        else delete xx[xxKey];
      }
      else xx[xxKey] = val || dv || '';
    }

    // option key
    if (oKey && !xxKey) {
      // clear custom bore if bore is no longer custom
      if (oKey === 'bore' && val !== 'User Defined') {
        selected.customBore = '';
      }
      // if spec changed reset spec values
      if (oKey === 'spec' && selected.spec !== val) {
        selected.nSize = '';
        selected.pClass = '';
        if (selected.bore) {
          selected.bore = '';
          selected.customBore = '';
        }
        if (val !== 'SEMPRA') selected.sempraSpec = '';
        state.dims = {};
        filters.size = '';
        filters.pClass = '';
        filters.maxEOD = '';
        filters.maxFOD = '';
        filters.maxPressure = '';
      }
      // else if (oKey === 'dueDate') selected.due = new Date(`${val}T${selected.dueTime}`).toISOString();
      // else if (oKey === 'dueTime') selected.due = new Date(`${selected.dueDate}T${val}`).toISOString();
      // update key value
      selected[oKey] = val;
    }

    // set dims
    if (oKey === 'nSize' || oKey === 'pClass') {
      const { spec, nSize, pClass } = state.selected;
      const size = Array.isArray(nSize) ? nSize[0] : nSize;
      if (spec && size && pClass) {
        // console.log({ spec, nSize, pClass })
        const dims = state.specs.find(s => s.spec === spec && s.size === size && s.pClass === pClass);
        // console.log('--> set dims', dims)
        if (dims) {
          state.dims = { ...dims };
          filters.maxEOD = dims.flangeOD;
          filters.maxFOD = dims.bcd - dims.hd;
          filters.maxPressure = dims.operating;
        }
        else {
          state.dims = {};
          filters.maxEOD = '';
          filters.maxFOD = '';
          filters.maxPressure = '';
        }
        if (spec === 'SEMPRA' && pClass > 300) selected.bore = 'User Defined';
        if (spec === 'AWWA') selected.bore = pClass;
      }
      // set bore
      if (spec && size && !state.selected.bore) {
        if (spec === 'ANSI B16.5') selected.bore = 'STD';
        if (spec === 'AWWA') selected.bore = pClass;
        if (spec === 'BS EN 1092-1:2007') selected.bore = 'BS';
        if (spec === 'API') selected.bore = 'API';
        if (spec === 'SEMPRA') selected.bore = 'SM';
        if (spec === 'ENBRIDGE') selected.bore = 'STD';
        if (spec === 'SEVAL') selected.bore = 'SV';
      }
    }

    if (!filters.f_swSet && ['ik_kit', 'ik_swSet'].indexOf(selected.product) !== -1) filters.f_swSet = 'DBL';

    // filter key
    if (fKey) {
      if (fVal) filters[fKey] = fVal;
      else filters[fKey] = val;
    }
    if (fKey === 'size') filters[fKey] = Array.isArray(val) ? val[0] : val;
    if (selected[fKey] && val === false) delete selected[fKey];

    state.filters = { ...filters };
    state.selected = { ...selected };
    // optimize so only if something changed to update the objects
    // if (Object.keys(filters).length > 0) state.filters = Object.assign(state.filters, filters);
    // if (Object.keys(xx).length > 0) {
    //   state.selected.xx = xx;
    //   state.selected = Object.assign({}, state.selected, selected);
    // }
    // else if (Object.keys(selected).length > 0) state.selected = Object.assign({}, state.selected, selected);
    // else state.dims = Object.assign({});
    // console.log({ ...state.selected }, { ...state.filters });
  },
  ADD_KEY(state, { oKey, fKey, xxKey, default: dv }) {
    const editPart = state.editParts[0] ? state.editParts[0].q || {} : {};
    let val = dv !== undefined ? state.rmvCache[oKey] || dv : '';
    if (editPart[oKey] !== undefined) val = editPart[oKey];

    // if (!xxKey) console.log(`%c+++ %c${[oKey, fKey, xxKey]} | d: ${dv} | ${ xxKey ? `x: ${editPart.xx[oKey]}` : `e: ${editPart[oKey]}`}`, 'color: green',  'color: lightblue')
    if (oKey && !state.selected[oKey] && !xxKey) {
      state.selected[oKey] = val;
      state.selected = { ...state.selected };
    }

    if (fKey && state.filters[fKey] === undefined && !xxKey) {
      if (dv !== undefined) state.filters[fKey] = dv;
      else state.filters[fKey] = '';
      state.filters = { ...state.filters };
    }
  },
  RMV_KEY(state, { oKey, fKey, xxKey }) {
    // const editPart = state.editParts[0] ? state.editParts[0].q || {} : {};
    // console.log(`%c--- %c${[oKey, fKey, xxKey]}`, 'color: red',  'color: lightblue' )
    if (fKey) {
      delete state.filters[fKey];
      state.filters = { ...state.filters };
    }
    if (oKey) {
      if (oKey === 'kammPro') state.rmvCache[oKey] = false;
      else state.rmvCache[oKey] = state.selected[oKey];
      delete state.selected[oKey];
      state.selected = { ...state.selected };
      delete state.disable[oKey];
      state.disable = { ...state.disable };
    }
    if (xxKey) {
      delete state.selected.xx[xxKey];
      state.selected = { ...state.selected };
    }
    // clear spec
    if (oKey === 'spec') {
      state.selected.nSize = '';
      state.selected.pClass = '';
      if (state.selected.bore) {
        state.selected.bore = '';
        state.selected.customBore = '';
      }
      state.dims = {};
      state.filters = Object.assign(state.filters, {
        nSize: '', pClass: '', maxPressure: '', maxFOD: '', maxEOD: '',
      });
    }
  },
};

// TODO find a better way to get defaults since it reuses the same code, to find brand info
// use it only for computed values, other wise state can be used
const getters = {
  status: state => state.status,
  editParts: state => state.editParts,
  selected: state => state.selected,
  disable: state => state.disable,
  filters: state => state.filters,
  dims: state => state.dims,
  specs: state => state.specs,
  bores: state => state.bores,
  // getOpTitle: state => (dp, val) => {
  //   if (!state.dpList[dp] || !state.dpList[dp].options) return val;
  //   const opt = state.dpList[dp].options.find(doc => doc.value === val);
  //   if (!opt) return val;
  //   return opt.text;
  // },
  gTypeList: state => brandSelected => state.gTypes.filter(doc =>
    (doc.brands.indexOf('all') !== -1 || doc.brands.indexOf(brandSelected) !== -1) &&
    doc.exclude.indexOf(brandSelected) === -1
  ),
  gTypeTitle: state => gTypeSelected => {
    const titleList = state.gTypes.filter(doc => doc.value === gTypeSelected);
    if (titleList.length > 0) {
      return titleList[0].text;
    }
    return gTypeSelected;
  },
  facingList: state => brandSelected => state.facings.filter(
    doc => doc.brands.indexOf(brandSelected) !== -1,
  ),
  facingTitle: state => selectedFacing => {
    const titleList = state.facings.filter(doc => doc.value === selectedFacing);
    if (titleList.length > 0) {
      return titleList[0].text;
    }
    return selectedFacing;
  },
  retainerList: state => brandSelected => state.retainers.filter(
    retainer => retainer.brands.indexOf(brandSelected) !== -1,
  ),
  retainerTitle: state => (brandSelected, selectedRetainer) => {
    const titleList = state.retainers.filter(doc =>
      doc.value === selectedRetainer &&
      doc.brands.indexOf(brandSelected) !== -1
    );
    if (titleList.length > 0) {
      return titleList[0].text;
    }
    return selectedRetainer;
  },
  meshList: state => state.meshes,
  modular: state => state.modular,
  bolt: state => state.bolt,
  dpList: state => state.dpList,
};

const dp = {
  namespaced: true,
  modules: {
    products,
    brands,
    seals,
    sleeves,
    isoWashers,
    retWashers,
    xx,
  },
  state,
  actions,
  mutations,
  getters,
};

export default dp;
