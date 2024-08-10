/* eslint-disable no-underscore-dangle */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

import psService from './ps.service';
import itemService from '../../_modules/item.service';

const state = {
  _id: '',
  list: { kits: {}, gaskets: {}, sets: [], other: [] },
  q: {},
  thumb: {},
  tableColumnKey: 'pClass',
  tableRowKey: 'nSize',
  mm: {
    // al: 0.67,
    // mg: 0.74,
    // ml: 0.4,
    // sp: 0.69,
    // lp: 0.74,
    // mh: 0.8,
  },
  pList: [
    // {
    //   spec: 'ANSI B16.5',
    //   nSize: 'row',
    //   pClass: 'col',
    //   nc: 1.00,
    //   aMat: 1.00,
    //   pb: 1.00,
    //   ac: 1.00,
    //   og: 5.00,
    //   mh: 6.00,
    //   dJLM: 2.00,
    // },
    // {
    //   spec: 'ANSI B16.5',
    //   nSize: 'row',
    //   pClass: 'col2',
    //   nc: 10.00,
    //   aMat: 10.00,
    //   pb: 10.00,
    //   ac: 10.00,
    //   og: 50.00,
    //   mh: 60.00,
    // },
    // {
    //   spec: 'ANSI B16.5',
    //   nSize: 'row',
    //   pClass: 'col3',
    //   nc: 100.00,
    //   aMat: 100.00,
    //   pb: 100.00,
    //   ac: 100.00,
    //   og: 500.00,
    //   mh: 600.00,
    // },
  ],
  // do not save
  showCompare: true,
  spec: '',
  tableColumns: [
    // 'col',
    // 'col2',
    // 'col3',
  ],
  tableRows: [
    // 'row',
  ],
  status: {
    isGetPending: false,
    error: false,
  },
  priceStatus: {},
  distSet: [],
  show: {
    sl: false,
    ga: false,
    ml: false,
    al: false,
    mg: true,
    sp: true,
    lp: true,
    og: false,
    mh: false,
    temp: false,
  },
  psError: false,
};

// const quote = JSON.parse(localStorage.getItem('quote'));
// const state = quote
//   ? { status: { loggedIn: true }, token: quote.token, quote: quote.payload }
//   : { status: { loggedOut: true }, token: null, quote: null };

// const setThumb = async query => {
//   if (query.product === 'isoWasher' ||
//     query.product === 'retWasher'
//   ) {
//     query.brand = 'PW';
//   }
//   else if (query.product === 'isoTube') {
//     query.sleeveL = 72;
//   }
//   else if (query.product === 'isoSleeve') {
//     query.sleeveL = 1;
//   }
//   else {
//     query.spec = 'ANSI B16.5';
//     query.nSize = '2';
//     query.pClass = '300';
//     query.bore = 'STD';
//   }
//   const item = await itemService.getItemThumb(query);
//   return item.thumb;
// };

// const setRows = query => {
//   let tableRowKey = '';
//   if (
//     query.product === 'isoSleeve' ||
//     query.product === 'isoTube' ||
//     query.product === 'isoWasher' ||
//     query.product === 'retWasher'
//   ) {
//     tableRowKey = 'boltSize';
//   }
//   else {
//     tableRowKey = 'nSize';
//   }
//   return { tableRowKey };
// };

// const setColumns = query => {
//   // console.log(query)
//   // console.log(payload)
//   let tableColumnKey = '';
//   if (query.product === 'retWasher') {
//     tableColumnKey = 'retMat';
//   }
//   else if (query.product === 'isoWasher') {
//     tableColumnKey = 'retMat';
//   }
//   else if (query.product === 'isoSleeve' || query.product === 'isoTube') {
//     tableColumnKey = 'sleeveM';
//   }
//   else {
//     tableColumnKey = 'pClass';
//   }
//   return { tableColumnKey };
// };

const actions = {
  async getList({ dispatch, commit }) {
    try {
      const ps = await psService.getList();
      commit('SET_LIST', ps);
      dispatch('alert/success', { title: 'LOADED', message: 'Margin List' }, { root: true });
    }
    catch (err) {
      dispatch('alert/error', err, { root: true });
    }
  },
  async loadPS({ dispatch, commit }, payload) {
    try {
      const { query } = payload;
      // console.log(query);
      commit('SET_PS_PENDING');
      const ps = await psService.loadPS(encodeURIComponent(JSON.stringify(query)));
      commit('SET_PS', { ps });
      dispatch('validatePriceSheet');
      dispatch('alert/success', { title: 'LOADED PRICE SHEET', message: query.brand }, { root: true });
    }
    catch (err) {
      commit('SET_PS_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async savePS({ dispatch, commit, state }) {
    try {
      // console.log(state);
      const data = {
        _id: state._id || 'new',
        q: state.q,
        thumb: state.thumb,
        mm: state.mm,
        tableColumnKey: state.tableColumnKey,
        // tableColumns: state.tableColumns,
        tableRowKey: state.tableRowKey,
        // tableRows: state.tableRows,
        pList: state.pList,
      };
      delete data.mm.temp;
      // TODO send only the difference not a the whole state
      // console.log(data)
      // let ps = data;
      const ps = await psService.savePS(data);
      // console.log(ps);
      commit('SET_PS', { ps });
    }
    catch (err) {
      // commit('SET_PS_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async validatePriceSheet({ commit, state }) {
    if (state.q && state.q.brand && state.tableRows.length > 0 && state.tableColumns.length > 0) {
      const { q, spec = 'ANSI B16.5', tableColumnKey, tableColumns, tableRowKey, tableRows } = state;
      const items = await itemService.matrix({ q, spec, tableColumnKey, tableColumns, tableRowKey, tableRows });

      for (const item of items) {
        const query = item.q;
        let pli = -1;
        pli = state.pList.findIndex(p =>
          query && (state.spec ? p.spec === state.spec : true) &&
          // eslint-disable-next-line eqeqeq
          p[state.tableRowKey] == query[state.tableRowKey] &&
          // eslint-disable-next-line eqeqeq
          p[state.tableColumnKey] == query[state.tableColumnKey]
        );

        if (pli == -1) commit('SET_TABLE_CELL', { item, pli });
        // else {
        //   // console.error('duplicate??', query, state.pList[pli]);
        //   // state.pList.splice(pli, 1, query);
        // }
      }
    }
  },
  addDistMM({ commit }, tag) {
    commit('ADD_DIST_MM', tag);
  },
  toggleShowCompare({ commit }) {
    commit('SET_SHOW_COMPARE');
  },
  setSpec({ commit }, spec) {
    commit('SET_SPEC', spec);
  },
  setTableColKey({ commit }, key) {
    commit('SET_TABLE_COL_KEY', key);
  },
  setTableRowKey({ commit }, key) {
    commit('SET_TABLE_ROW_KEY', key);
  },
  setTableRows({ commit, dispatch }, { rows, selected }) {
    const update = state.tableRows.toString() !== rows.toString() &&
      selected.brand && state.q.brand === selected.brand &&
      state.q.product === selected.product;

    commit('SET_TABLE_ROWS', rows);
    if (update) dispatch('validatePriceSheet');
  },
  setTableCols({ commit, dispatch, state }, { cols, selected }) {
    const update = state.tableColumns.toString() !== cols.toString() &&
      selected.brand && state.q.brand === selected.brand &&
      state.q.product === selected.product;

    commit('SET_TABLE_COLS', cols);
    if (update) dispatch('validatePriceSheet');
  },
};

const mutations = {
  // quote line related
  SET_PS_PENDING(state) {
    state.status.isGetPending = true;
    state.psError = false;
    state.pList = [];
    // state.distSet = [];
    state._id = '';
  },
  SET_PS_FAILED(state, error) {
    state.status.isGetPending = false;
    if (error.response) {
      state.psError = {
        status: error.response.status,
        message: error.response.data,
      };
    }
    else {
      state.psError = {
        message: error,
      };
    }
  },
  UPDATE_ITEM_PRICE(state, { row, col, value, priceKey }) {
    // console.log(payload)
    const pli = state.pList.findIndex(p =>
      (state.spec ? p.spec === state.spec : true) &&
      p[state.tableRowKey] === row &&
      p[state.tableColumnKey] === col
    );
    // console.log(pli)
    if (pli !== -1) {
      const tableCell = JSON.parse(JSON.stringify(state.pList[pli]));
      const number = parseFloat(value);
      if (priceKey !== 'temp' && typeof number === 'number') tableCell[priceKey] = number;
      if (pli !== -1) state.pList.splice(pli, 1, tableCell);
    }
  },
  ADD_DIST_MM(state, tag) {
    // console.log(tag, state.show[tag])
    const showCopy = { ...state.show };
    if (showCopy[tag] === undefined) showCopy[tag] = true;
    state.show = showCopy;
    const mmCopy = { ...state.mm };
    if (mmCopy[tag] === undefined) mmCopy[tag] = mmCopy.sp;
    state.mm = mmCopy;

    const ti = state.distSet.findIndex(p => p === tag);
    if (ti !== -1) state.distSet.splice(ti, 1, tag);
    else state.distSet.push(tag);
    // console.log(state.mm)
  },
  UPDATE_MM(state, { marginKey, value }) {
    if (value === '') state.mm[marginKey] = '';
    else {
      const number = parseFloat(value);
      if (typeof number === 'number') state.mm[marginKey] = number;
    }
  },
  // item set / table set
  SET_PS(state, { ps }) {
    // console.log(ps);
    const { _id, q, thumb, mm, pList, tableRowKey, tableColumnKey } = ps;
    state.q = q;
    state.thumb = thumb;
    mm.temp = state.mm.temp || 0.35;
    state.mm = mm;
    if (tableColumnKey) state.tableColumnKey = tableColumnKey;
    if (tableRowKey) state.tableRowKey = tableRowKey;
    if (pList) {
      state.pList = pList;
      // get unique table rows and columns
      const trs = [];
      const tcs = [];
      for (const cell of pList) {
        // if (cell.spec && cell.spec !== state.spec) continue;
        if (trs.indexOf(cell[tableRowKey]) === -1) trs.push(cell[tableRowKey]);
        if (tcs.indexOf(cell[tableColumnKey]) === -1) tcs.push(cell[tableColumnKey]);
      }
      state.tableRows = trs.sort((a, b) => a - b);
      state.tableColumns = tcs.sort((a, b) => a - b);
      // console.log(state.tableRows, state.tableColumns)
      if (!state._id) state.spec = pList[0].spec || '';
    }
    if (_id) state._id = _id;
    state.status.isGetPending = false;
  },
  SET_LIST(state, list) {
    const sorted = { kits: {}, sets: [], gaskets: {}, other: [] };
    for (const ps of list) {
      const marginKeys = Object.keys(ps.mm);
      ps.distMM = {};
      for(const mk of marginKeys) {
        if (mk.indexOf('d') === 0) {
          ps.distMM[mk.substring(1)] = ps.mm[mk];
        }
      }
      if (ps.q.product === 'ik_kit') {
        if (!sorted.kits[ps.q.brand]) sorted.kits[ps.q.brand] = [];
        sorted.kits[ps.q.brand].push(ps);
      }
      else if (ps.q.product === 'ik_gasket') {
        if (!sorted.gaskets[ps.q.brand]) sorted.gaskets[ps.q.brand] = [];
        sorted.gaskets[ps.q.brand].push(ps);
      }
      else if (ps.q.product === 'ik_swSet') sorted.sets.push(ps);
      else sorted.other.push(ps);
    }
    state.list = sorted;
  },
  SET_TABLE_CELL(state, { item, pli }) {
    // DO NOT add parts that were not understood...
    if (item && item.q && pli === -1) {
      const { q = {}, c = {}, p = {} } = item;
      const tableCell = {};
      if (q.spec) tableCell.spec = q.spec;
      tableCell[state.tableRowKey] = q[state.tableRowKey].toString();
      // if (q.brand === 'PW' || q.brand === 'MW') tableCell[state.tableColumnKey] = q.retMat.toString();
      // else
      tableCell[state.tableColumnKey] = q[state.tableColumnKey].toString();

      if (pli === -1) {
        // costs
        if (c.aMat) tableCell.aMat = c.aMat;
        if (c.sl) tableCell.sl = c.sl;
        if (c.pb) tableCell.pb = c.pb;
        if (c.ac) tableCell.ac = c.ac;
        // prices
        if (p.error) tableCell.error = p.error;
        if (p.og) tableCell.og = p.og;
        if (p.ml && !p.mlEst) tableCell.ml = p.ml;
        if (p.mh && !p.mhEst) tableCell.mh = p.mh;
        // push it to the price list
        state.pList.push(tableCell);
      }
      // else {
      //   // console.error('duplicate??', tableCell, state.pList[pli]);
      //   // state.pList.splice(pli, 1, tableCell);
      // }
    }
  },
  SET_SHOW_COMPARE(state) { state.showCompare = !state.showCompare; },
  SET_TABLE_ROW_KEY(state, key) { state.tableRowKey = key; },
  SET_TABLE_ROWS(state, rows) { state.tableRows = rows.sort((a, b) => a - b); },
  SET_TABLE_COL_KEY(state, key) { state.tableColumnKey = key; },
  SET_TABLE_COLS(state, columns) { state.tableColumns = columns.sort((a, b) => a - b); },
  SET_SPEC(state, spec) { state.spec = spec; },
};

const getters = {
  _id: state => state._id,
  status: state => state.status,
  list: state => state.list,
  q: state => state.q,
  p: state => state.p,
  mm: state => state.mm,
  show: state => state.show,
  showCompare: state => state.showCompare,
  tableColumnKey: state => state.tableColumnKey,
  tableColumns: state => state.tableColumns,
  tableRowKey: state => state.tableRowKey,
  tableRows: state => state.tableRows,
  psError: state => state.psError,
  showCount: state => {
    let count = 0;
    for (const s in state.show) {
      if (state.show[s]) count += 1;
    }
    return count;
  },
  tableCell: state => payload => state.pList.find(p =>
    (state.spec ? p.spec === state.spec : true) &&
    p[state.tableRowKey] === payload.row &&
    p[state.tableColumnKey] === payload.col),
  numberOfMM: state => Object.keys(state.mm).length,
};

const quote = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default quote;
