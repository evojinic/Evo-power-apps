/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

import orderService from './orders.service';
import itemService from '../../_modules/item.service';
import { parseInput, parseQuickInput } from '../../_core/pasteAnything';

const paddedAmericanDateFormat = date => {
  if (date.indexOf('-') !== -1) {
    const spl = date.split('-');
    // const m = spl[1] < 10 ? `0${spl[1]}` : spl[1];
    const m = spl[1];
    // const d = spl[2] < 10 ? `0${spl[2]}` : spl[2];
    const d = spl[2];
    const y = spl[0];
    return `${m}/${d}/${y}`;
  }
  return date;
};

const state = {
  status: {},
  lineStatus: {},
  list: [
    // { _id: 'TEST000001' },
    // { _id: 'TESTDV5495' },
  ],
  orders: [
    // { _id:'TEST0000IE',
    //   lines:{
    //     1:{
    //       job:'A000048644',
    //       item:'IK-6.0-IG-600#F-STD-G10N-VD',
    //       qtyOrdered:32,
    //       released:32,
    //       destination:'',
    //       source:'Job',
    //       jobDate:'',
    //       dueDate:'03/27/2018',
    //       lineNumber:'1',
    //       order:'',
    //       name:'',
    //       customer:'',
    //       orderDate:'',
    //       orderRef:'',
    //       ready:'',
    //       unitPrice:30.70668,
    //       unitCost:28.43219,
    //       imp:'2019-10-09T19:34:54.372Z',
    //       lead:'-13461.0818',
    //       due:'2019-07-27T22:30:00.000Z',
    //       warnings:{ keyNotUsed:{},
    //         valueDifference:{} },
    //       errors:[]
    //     },
    //   },
    //   PO:'test ignore',
    //   billTo:'Lamons Canada Ltd',
    //   comments:'',
    //   demandingSite:'SARN',
    //   dueDate:'',
    //   expedited:true,
    //   name:'Lamons Canada Ltd',
    //   orderDate:'03/08/2018',
    //   orderNumber:'TEST000001',
    //   originatingSite:'DNV',
    //   shipTo:'Lamons Canada Ltd',
    //   shipVia:'FIPC',
    //   takenBy:'Kristie.Larsh',
    //   _u:{
    //     lines:'2019-10-09T19:34:54.372Z',
    //     lineDetails:'2019-10-09T19:34:54.372Z',
    //     pTime:'2019-10-09T19:34:54.372Z',
    //     operations:'2019-10-09T19:34:54.372Z',
    //     dueTimes:'2019-10-09T19:34:54.372Z',
    //     dues:'2019-10-09T19:34:54.372Z',
    //     dueDetails:'2019-10-09T19:34:54.372Z'
    //   },
    //   dueDetails:{
    //     '3-27-2018':{ totalLines:{ NofL:5,
    //       qty:54,
    //       linesA:{ 1:'IK-6.0-IG-600#F-STD-G10N-VD',
    //         2:'IK-2.0-IG-600#F-STD-G10N-VD',
    //         3:'IK-6.0-IG-150#F-STD-G10N-VD',
    //         4:'IK-1.0-IG-150#F-STD-G10N-VD',
    //         5:'IK-2.0-IG-150#F-STD-G10N-VD' } },
    //     dueDate:'03/27/2018',
    //     importDate:'',
    //     customer:'Lamons Canada Ltd',
    //     shipDate:'',
    //     shipComment:'',
    //     PO:'test ignore',
    //     expedited:true,
    //     comments:'' }
    //   },
    //   dues:[
    //     { ln:'1',
    //       wc:'ship',
    //       qty:1,
    //       due:'2019-07-27T18:30:00.000Z' },
    //     { ln:'1',
    //       lnQty:1,
    //       wc:'boxing',
    //       pt:5,
    //       batch:1,
    //       qty:1,
    //       due:'2019-07-27T17:00:00.000Z' },
    //     { ln:'1',
    //       lnQty:1,
    //       wc:'retWcount',
    //       pt:5,
    //       batch:1,
    //       qty:1,
    //       due:'2019-07-27T15:00:00.000Z' },
    //     { ln:'1',
    //       lnQty:1,
    //       wc:'bagSleeves',
    //       pt:10,
    //       batch:1,
    //       qty:1,
    //       due:'2019-07-27T14:00:00.000Z' },
    //     { ln:'1',
    //       lnQty:1,
    //       wc:'cutSleeves',
    //       pt:20,
    //       batch:1,
    //       qty:1,
    //       due:'2019-07-27T15:30:00.000Z' },
    //     { ln:'1',
    //       lnQty:1,
    //       wc:'isoWcount',
    //       pt:20,
    //       batch:1,
    //       qty:1,
    //       due:'2019-07-27T15:30:00.000Z' },
    //     { ln:'1',
    //       lnQty:1,
    //       wc:'seals',
    //       pt:5,
    //       batch:1,
    //       qty:1,
    //       due:'2019-07-27T01:05:00.000Z' },
    //     { ln:'1',
    //       lnQty:1,
    //       wc:'machining',
    //       pt:60,
    //       batch:1,
    //       qty:1,
    //       due:'2019-07-26T20:25:00.000Z' },
    //     { ln:'1',
    //       lnQty:1,
    //       wc:'laser',
    //       pt:5,
    //       batch:1,
    //       qty:1,
    //       due:'2019-07-26T18:10:00.000Z' },
    //     { ln:'1',
    //       lnQty:1,
    //       wc:'wj',
    //       pt:30,
    //       batch:1,
    //       qty:1,
    //       due:'2019-07-26T07:00:00.000Z' }
    //   ],
    // }
  ],
  order: {
    _id: '',
    lines: {},
    lineDetails: [],
  },
  orderSelected: '',
  drawings: '',
  // labels: '',
  importList: [],
  importSelected: '',
  lastSyncDate: 'no date',
};

const actions = {
  async openOrderList({ dispatch, commit }, payload) {
    try {
      const { since } = payload || {};
      // commit('SET_ORDER_LIST', await orderService.get('list', ''));
      commit('ADD_STATUS_KEY', 'loading_flag');
      const entityList = await orderService.sync({ sync: 'list', since: since || state.lastSyncDate, wcDues: 1 });
      commit('LAST_SYNC_UPDATE');
      commit('SET_ORDER_LIST', entityList);
    }
    catch (err) {
      commit('SET_ORDERS_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async loadOrderDrawings({ dispatch, commit, state }, order_id) {
    if (order_id) {
      try {
        commit('ADD_STATUS_KEY', `loading_${order_id}_dwg`);
        const lines = Object.keys(state.order.lines);
        const drawings = await orderService.get(order_id, `?gad=1&lines=[${lines.join(',')}]`);
        commit('SET_DRAWINGS', drawings);
        // if (res.order) commit('SET_ORDERS', [res.order]);
      }
      catch (err) {
        commit('SET_ORDERS_FAILED', err);
        dispatch('alert/error', err, { root: true });
      }
      commit('REMOVE_STATUS_KEY', `loading_${order_id}_dwg`);
    }
  },
  async generateLabel({ dispatch, commit }, { order_id, type, ln }) {
    if (order_id) {
      try {
        commit('ADD_STATUS_KEY', `loading_${order_id}_labels`);
        const res = await orderService.get(order_id, `?labels=${type}&lines=[${ln}]&name=gasketApp&lineDetails=1&zpl=1`);
        commit('SET_LABELS', res.labels);
        if (res.order) commit('SET_ORDER', res.order);
        if (res.order) commit('SET_ORDERS', [res.order]);
      }
      catch (err) {
        commit('SET_ORDERS_FAILED', err);
        dispatch('alert/error', err, { root: true });
      }
      commit('REMOVE_STATUS_KEY', `loading_${order_id}_labels`);
    }
  },
  async loadOrder({ dispatch, commit, state }, { order_id, displayError = true }) {
    if (order_id && order_id !== state.order._id) {
      try {
        commit('ADD_STATUS_KEY', `loading_${order_id}`);
        const order = await orderService.get(order_id);
        order.lineDetails = order.lineDetails.map(item => {
          if (!item.pack) item.pack = [];
          return item;
        });
        commit('SET_ORDER', order);
        commit('SET_ORDERS', [order]);
        order.lineDetails.forEach((item, index) => {
          if (item.pack.length === 0) dispatch('lookItemWeight', { index, item });
        });
      }
      catch (err) {
        commit('SET_ORDERS_FAILED', err);
        if (displayError) dispatch('alert/error', err, { root: true });
      }
      commit('REMOVE_STATUS_KEY', `loading_${order_id}`);
    }
  },
  async lookItemWeight({ commit }, { index, item }) {
    if (!item || !item.pn) return;
    try {
      commit('SET_ITEM_WEIGHT', { index, pack: [{ loading: true }] });
      const list = await itemService.getPackFromList({ list: [item] });
      if (list) commit('SET_ITEM_WEIGHT', { index, pack: list[0].pack });
    }
    catch (err) {
      commit('SET_ITEM_WEIGHT', { index, pack: [{ error: 'oops' }] });
    }
  },
  async updateOrder({ dispatch, commit, state }) {
    if (state.order._id) {
      try {
        commit('ADD_STATUS_KEY', `saving_${state.order._id}`);
        const order = await orderService.update(state.order._id, state.order);
        commit('SET_ORDER', order);
        commit('SET_ORDERS', [order]);
        dispatch('alert/success', { title: `${state.order._id}`, message: 'UPDATED' }, { root: true });
      }
      catch (err) {
        commit('SET_ORDERS_FAILED', err);
        dispatch('alert/error', err, { root: true });
      }
      commit('REMOVE_STATUS_KEY', `saving_${state.order._id}`);
    }
  },
  async addOrder({ dispatch, commit }, { order_id }) {
    if (order_id) {
      try {
        commit('ADD_STATUS_KEY', `loading_${order_id}`);
        commit('SET_ORDERS', [await orderService.get(order_id)]);
      }
      catch (err) {
        commit('SET_ORDERS_FAILED', err);
        dispatch('alert/error', err, { root: true });
      }
      commit('REMOVE_STATUS_KEY', `loading_${order_id}`);
    }
  },
  removeOrder({ dispatch, commit }, { order_id }) {
    if (order_id) {
      try {
        commit('REMOVE_ORDER', order_id);
      }
      catch (err) {
        commit('SET_ORDERS_FAILED', err);
        dispatch('alert/error', err, { root: true });
      }
    }
  },
  async addItem({ dispatch, commit, state }, payload) {
    try {
      let { index, query, qty } = payload;
      // query.dist = state.order.dist;
      // query = encodeURIComponent(JSON.stringify(query));
      const lineDetails = [...state.order.lineDetails];
      let item = {
        pn: '... loading ...',
        q: {},
      };
      // ensure things get added in proper order
      if (index === undefined) {
        // set blank place holder
        index = lineDetails.length;
      }
      else {
        // eslint-disable-next-line prefer-destructuring
        qty = lineDetails[index].qty;
        item = {
          pn: '... updating ...',
          q: {},
          qty,
        };
      }

      // console.log(query)
      commit('SET_LINE_STATUS', { ln: lineDetails[index].ln });
      if (query.product === 'charge') item = { pn: query.pn, desc: query.desc, q: query, p: { up: query.up } };
      else if (query.product === 'custom') item = { pn: query.pn, desc: query.desc, q: query, p: { up: query.up } };
      else item = await itemService.getItemPB(encodeURIComponent(JSON.stringify(query)));
      commit('SET_ITEM', { index, item, qty, dueDate: query.dueDate });
      dispatch('alert/success', { title: `UPDATED Line: ${index + 1}`, message: item.pn }, { root: true });
    }
    catch (err) {
      // console.log(err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async setDueDate({ dispatch, commit, state }, payload) {
    try {
      const { index, query } = payload;
      const lineDetails = [...state.order.lineDetails];
      const item = lineDetails[index];
      const { qty } = lineDetails[index];
      commit('SET_ITEM', { index, item, qty, dueDate: query.dueDate });
      dispatch('alert/success', { title: `Due Date UPDATED Line: ${index + 1}`, message: item.pn }, { root: true });
    }
    catch (err) {
      // console.log(err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async importQuickOrderEntry({ dispatch, commit }, { data }) {
    try {
      commit('ADD_STATUS_KEY', 'order_import');
      const order = await orderService.create(data);
      if (order._id) commit('SET_SELECTED_ORDER', order._id);
      // if (state.importList.length === 1) dispatch('loadOrder', data.oDetails.order_id);
      commit('CLEAR_IMPORT_ID');
      dispatch('hb/moveStatusHBQ', {}, { root: true });
      dispatch('openOrderList');
    }
    catch (err) {
      commit('SET_ORDERS_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
    commit('REMOVE_STATUS_KEY', 'order_import');
  },
  addToImportList({ commit }, { inputText, inputTextOrder, inputTextLines }) {
    if (inputText) {
      const importList = parseInput(inputText);
      if (importList) commit('SET_IMPORT_LIST', importList);
    }
    else if (inputTextOrder && inputTextLines) {
      const importOrder = parseQuickInput({ inputTextOrder, inputTextLines });
      if (importOrder) commit('SET_IMPORT_LIST', [importOrder]);
    }
  },
  async selectImport({ commit, dispatch }, { import_id }) {
    commit('SET_IMPORT_ID', import_id);
    try {
      commit('ADD_STATUS_KEY', `loading_${import_id}`);
      const order = await orderService.get(import_id);
      // console.log(import_id);
      // console.log(order);
      commit('SET_ORDERS', [order]);
    }
    catch (err) {
      // console.log(err);
      dispatch('alert/error', err, { root: true });
    }
    commit('REMOVE_STATUS_KEY', `loading_${import_id}`);
  },
  deselectImport({ commit }) {
    commit('CLEAR_IMPORT_ID');
  },
  selectOrder({ commit }, order_id) {
    commit('SET_SELECTED_ORDER', order_id);
  },
};

const mutations = {
  SET_LINE_STATUS(state, payload) {
    const { ln } = payload;
    state.lineStatus[ln] = { loading: true };
  },
  ADD_STATUS_KEY(state, load) {
    const status = { ...state.status };
    status[load] = true;
    state.status = status;
  },
  REMOVE_STATUS_KEY(state, load) {
    const status = { ...state.status };
    delete status[load];
    state.status = status;
  },
  SET_ORDER_LIST(state, list) {
    // console.log(list);
    if (typeof list !== 'string') {
      // eslint-disable-next-line no-restricted-syntax
      for (const order of list) {
        const index = state.list.findIndex(sq => sq._id === order._id);
        // console.log(index);
        if (index !== -1) state.list.splice(index, 1, order);
        else state.list.push(order);
      }
    }
  },
  SET_ORDERS(state, orders) {
    if (typeof orders !== 'string') {
      // eslint-disable-next-line no-restricted-syntax
      for (const order of orders) {
        const index = state.orders.findIndex(sq => sq._id === order._id);
        // console.log(index);
        if (index !== -1) state.orders.splice(index, 1, order);
        else state.orders.push(order);
      }
    }
    // state.orders = state.orders.sort((o1, o2) => new Date(o1.orderDate).valueOf() - new Date(o2.orderDate).valueOf());
    // console.log(state.orders);
  },
  SET_DRAWINGS(state, drawings) {
    // console.log(drawings);
    state.drawings = drawings;
  },
  SET_LABELS(state, labels) {
    // console.log(labels);
    state.labels = labels;
  },
  SET_SELECTED_ORDER(state, order_id) {
    // console.log('SET_SELECTED_ORDER', order_id);
    if (state.orderSelected === order_id) state.orderSelected = '';
    else state.orderSelected = order_id;
  },
  SET_ORDER(state, order) {
    // console.log(order);
    state.order = { ...order };
  },
  REMOVE_ORDER(state, order_id) {
    const index = state.orders.findIndex(sq => sq._id === order_id);
    // console.log(index);
    // if (index !== -1) state.orders.splice(index, 1);
    if (index !== -1) state.orders.splice(index, 1);
  },
  SET_ORDERS_FAILED(state, error) {
    // state.status = { error: true };
    // state.orders = [];
    if (error.response) {
      state.ordersError = {
        status: error.response.status,
        message: error.response.data,
      };
    }
    else {
      state.ordersError = {
        status: 'error',
        message: error,
      };
    }
  },
  // single order functions
  SET_ITEM(state, payload) {
    const { index, item, qty, dueDate } = payload;
    if (!item.qty) item.qty = qty || 1;
    const currentItem = state.order.lineDetails[index];
    currentItem.q = item.q;
    currentItem.pn = item.pn;
    currentItem.thumb = item.thumb;
    currentItem.pbBom = item.pbBom;
    currentItem.nest = item.nest;
    if (dueDate) state.order.lines[currentItem.ln].dueDate = paddedAmericanDateFormat(dueDate);
    state.order.lineDetails.splice(index, 1, currentItem);
    delete state.lineStatus[currentItem.ln];
  },
  SET_IMPORT_LIST(state, importList) {
    if (typeof importList !== 'string') {
      for (const imp of importList) {
        const index = state.importList.findIndex(sq => sq._id === imp._id);
        if (index !== -1) state.importList.splice(index, 1, imp);
        else state.importList.push(imp);
      }
      if (state.importList.length > 0 && !state.importSelected) {
        state.importSelected = state.importList[0]._id;
      }
    }
  },
  SET_IMPORT_ID(state, import_id) {
    if (import_id) state.importSelected = import_id;
  },
  CLEAR_IMPORT_ID(state) {
    if (state.importSelected) {
      const index = state.importList.findIndex(sq => sq._id === state.importSelected);
      if (index !== -1) state.importList.splice(index, 1);
      state.importSelected = '';
      if (state.importList.length > 0 && !state.importSelected) {
        state.importSelected = state.importList[0]._id;
      }
    }
  },
  LAST_SYNC_UPDATE(state) { state.lastSyncDate = new Date(); },
  SET_ITEM_WEIGHT(state, { index, pack }) {
    state.order.lineDetails[index].pack = pack;
  },
};

// const ascending = (a, b, key) => {
//   if (a[key] < b[key]) return -1;
//   if (a[key] > b[key]) return 1;
//   return 0;
// };

// const descending = (a, b, key) => {
//   if (a[key] > b[key]) return -1;
//   if (a[key] < b[key]) return 1;
//   return 0;
// };

const getters = {
  status: state => state.status,
  lineStatus: state => state.lineStatus,
  importList: state => state.importList,
  orderError: state => state.orderError,
  labels: state => state.labels,
  drawings: state => state.drawings,
  current: state => state.order,
  lineDetails: state => state.order.lineDetails || [],
  orderLabels: state => state.order.labels || [],
  importSelected: state => state.importSelected,
  importNewOrder: state => state.importList.find(o => o._id === state.importSelected) || {},
  importExistingOrder: state => state.orders.find(o => o._id === state.importSelected) || null,
  orderSelected: state => state.orderSelected,
  order: state => state.orders.find(o => o._id === state.orderSelected) || null,
  orderByID: state => _id => state.orders.find(o => o._id === _id) || null,
  ordersList: state => state.list || [],
  orders: state => state.orders || [],
  orderLineDetails: state => {
    const order = state.orders.find(o => o._id === state.orderSelected);
    if (!order) return null;
    if (!order.lineDetails) return 'loading';
    return order.lineDetails;
  },
};

const orders = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default orders;
