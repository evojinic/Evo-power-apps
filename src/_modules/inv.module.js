/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

import invService from './inv.service';

const totalIn = row => (row.inv_oo || 0) + (row.inv_wip || 0) + (row.inv_ot || 0);
const totalOut = row => (row.inv_a2o || 0) + (row.inv_a2p || 0) + (row.inv_a2t || 0);
const reorderQty = row => {
  let short = (row.totalOut || 0) + (row.inv_ss || 0) - (row.totalIn || 0) - (row.inv_oh || 0);
  if (short <= 0) return 0;
  // add missing amount to get to full stock
  if (short >= 0) short += row.inv_ss * 0.5;
  // oder in multiples
  if (row.inv_o_qty > 0) short = Math.ceil(short / row.inv_o_qty) * row.inv_o_qty;
  // order minimum if short is less than that
  if (row.inv_o_min > short) short = row.inv_o_min;
  if (short > 0) return short;
  return 0;
};
const defaultPC = pc => {
  if (!pc) return true;
  if ((/.*b$/).test(pc)) return false;
  if ((/.*g$/).test(pc)) return false;
  if ((/.*s$/).test(pc)) return false;
  if ((/.*c$/).test(pc)) return false;
  if ((/FSt/).test(pc)) return false;
  if ((/FSm/).test(pc)) return false;
  if ((/FSr/).test(pc)) return false;
  if ((/^FS./).test(pc)) return false;
  if ((/vCP/).test(pc)) return false;
  if ((/CU/).test(pc)) return false;
  if ((/CSL/).test(pc)) return false;
  if ((/SET/).test(pc)) return false;
  if ((/SnW/).test(pc)) return false;
  return true;
};

const state = {
  isPendingNeg: false,
  isPendingShort: false,
  isPendingReorder: false,
  inv: [],
  plannerCodes: {},
};

const actions = {
  async fetchINV({ dispatch, commit }, itemPN) {
    try {
      if (itemPN === 'neg') {
        commit('STATUS_PENDING', 'isPendingNeg');
        commit('SET_INV_ITEM', await invService.getNegatives());
        commit('STATUS_DONE', 'isPendingNeg');
      }
      else if (itemPN === 'short') {
        commit('STATUS_PENDING', 'isPendingShort');
        commit('SET_INV_ITEM', await invService.getShort());
        commit('STATUS_DONE', 'isPendingShort');
      }
      else if (itemPN === 'reorder') {
        commit('STATUS_PENDING', 'isPendingReorder');
        commit('SET_INV_ITEM', await invService.getReorder());
        commit('STATUS_DONE', 'isPendingReorder');
      }
      else commit('SET_INV_ITEM', await invService.getUsersQuotes(itemPN));
    }
    catch (err) {
      dispatch('alert/error', err, { root: true });
    }
  },
  setInvItem({ commit }, item) {
    // console.log(item);
    commit('SET_INV_ITEM', [item]);
  },
};

const mutations = {
  STATUS_PENDING(state, key) {
    state[key] = true;
    // console.log('getting', key);
  },
  STATUS_DONE(state, key) {
    state[key] = false;
    // console.log('done', key);
  },
  SET_INV_ITEM(state, inv) {
    state.status = { loaded: true };
    // eslint-disable-next-line no-restricted-syntax
    for (const item of inv) {
      const index = state.inv.findIndex(sq => sq._id === item._id);
      // console.log(index);
      if (index !== -1) state.inv.splice(index, 1);
      item.fullStock = parseFloat(item.inv_ss || 0) * 1.5;
      item.totalIn = totalIn(item);
      item.totalOut = totalOut(item);
      item.reorderQty = reorderQty(item);
      state.inv.push(item);
      if (!state.plannerCodes[item.pc]) {
        state.plannerCodes[item.pc] = defaultPC(item.pc);
      }
    }
    // console.log(state.inv);
  },
};

const getters = {
  negatives: state => state.inv.filter(item => item.inv_oh < 0),
  reorder: state => state.inv.filter(row => row.reorderQty > 0),
};

const inv = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default inv;
