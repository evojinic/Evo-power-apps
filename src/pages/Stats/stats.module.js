/* eslint-disable no-underscore-dangle */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

import statsService from './stats.service';

const state = {
  status: {},
  transactions: [
  ],
};

const actions = {
  async transactionsQuery({ commit }, query) {
    // console.log(query);
    try {
      commit('ADD_STATUS_KEY', 'loading_transactions');
      const transactions = await statsService.getTransactions(query);
      commit('SET_TRANSACTIONS', transactions);
      commit('REMOVE_STATUS_KEY', 'loading_transactions');
    }
    catch (err) {
      // console.error(err);
      commit('REMOVE_STATUS_KEY', 'loading_transactions');
      // commit('SET_ORDERS_FAILED', err);
      // dispatch('alert/error', err, { root: true });
    }
  },
};

const mutations = {
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
  SET_TRANSACTIONS(state, transactions) {
    for (const transaction of transactions) {
      const index = state.transactions.findIndex(trn => trn._id === transaction._id);
      // console.log(index);
      if (index !== -1) state.transactions.splice(index, 1, transaction);
      else state.transactions.push(transaction);
    }
  },
};

const getters = {
  transactions: () => state.transactions.sort((a, b) => a.endStamp - b.endStamp),
  operatorsTransactions: () => name => state.transactions.filter(trn => trn.name === name),
};

const stats = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default stats;
