/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

import quoteService from './quotes.service';

const state = {
  status: {},
  stats: [],
  quotes: [],
  dnvQuotes: [],
  loadingQuotes: false,
  isForbidden: false,
  quotesError: false,
};

const actions = {
  async getUsersQuotes({ dispatch, commit }, user_id) {
    try {
      commit('SET_QUOTES_PENDING');
      // this could be one function... but it is more active on the user screen
      const expiredPromise = quoteService.getUsersQuotes(user_id, 'expired');
      const pendingPromise = quoteService.getUsersQuotes(user_id, 'pending');
      const inProcessPromise = quoteService.getUsersQuotes(user_id, 'inProcess');
      const inProductionPromise = quoteService.getUsersQuotes(user_id, 'inProduction');
      const shippedPromise = quoteService.getUsersQuotes(user_id, 'shipped');
      const newPromise = quoteService.getUsersQuotes(user_id, 'new');

      commit('SET_QUOTES', await expiredPromise);
      commit('SET_QUOTES', await pendingPromise);
      commit('SET_QUOTES', await inProcessPromise);
      commit('SET_QUOTES', await inProductionPromise);
      commit('SET_QUOTES', await shippedPromise);
      commit('SET_QUOTES', await newPromise);
      // TODO do not bother if user do not have access
      // if (user){
      commit('SET_DNV_QUOTES', await quoteService.get('verifyMaterial'));
      commit('SET_DNV_QUOTES', await quoteService.get('verifyBOM'));
      // }
      commit('SET_QUOTES_DONE');
    }
    catch (err) {
      commit('SET_QUOTES_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async loadMoreQuotes({ dispatch, commit }, { user_id, load, skip, limit }) {
    if (load) {
      try {
        commit('SET_QUOTES_KEY_PENDING', load);
        // this could be one function... but it is more active on the user screen
        commit('SET_QUOTES', await quoteService.getUsersQuotes(user_id, load, skip, limit));
        // }
        commit('SET_QUOTES_KEY_DONE', load);
      }
      catch (err) {
        commit('SET_QUOTES_FAILED', err);
        dispatch('alert/error', err, { root: true });
      }
    }
  },
  async stats({ dispatch, commit }) {
    try {
      commit('SET_QUOTES_KEY_PENDING', 'loading_stats');
      commit('SET_STATS', await quoteService.stats());
      commit('SET_QUOTES_KEY_DONE', 'loading_stats');
    }
    catch (err) {
      commit('SET_QUOTES_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
    dispatch('dist/setDistStats', {}, { root: true });
  },
  setQuote({ commit }, quote) {
    // console.log(quote);
    commit('SET_QUOTES', [quote]);
    commit('SET_DNV_QUOTES', [quote]);
  },
};

const mutations = {
  SET_QUOTES_KEY_PENDING(state, load) {
    const status = { ...state.status };
    status[`loading_${load}`] = true;
    state.status = status;
  },
  SET_QUOTES_PENDING(state) {
    state.loadingQuotes = true;
    state.quotesError = false;
    state.quotes = [];
  },
  SET_QUOTES_DONE(state) {
    state.loadingQuotes = false;
  },
  SET_QUOTES_KEY_DONE(state, load) {
    const status = { ...state.status };
    delete status[`loading_${load}`];
    state.status = status;
  },
  SET_QUOTES(state, quotes) {
    if (typeof quotes !== 'string') {
      // eslint-disable-next-line no-restricted-syntax
      for (const quote of quotes) {
        const index = state.quotes.findIndex(sq => sq._id === quote._id);
        // console.log(index);
        if (index !== -1) state.quotes.splice(index, 1, quote);
        else state.quotes.push(quote);
      }
    }
    // console.log(state.quotes);
  },
  SET_DNV_QUOTES(state, quotes) {
    if (typeof quotes !== 'string') {
      // eslint-disable-next-line no-restricted-syntax
      for (const quote of quotes) {
        const index = state.dnvQuotes.findIndex(sq => sq._id === quote._id);
        // console.log(index);
        if (index !== -1) state.dnvQuotes.splice(index, 1, quote);
        else state.dnvQuotes.push(quote);
      }
    }
    // console.log(state.quotes);
  },
  SET_QUOTES_FAILED(state, error) {
    // state.status = { error: true };
    // state.quotes = [];
    state.quotesError = {
      status: error.response.status,
      message: error.response.data,
    };
  },
  SET_STATS(state, stats) {
    state.stats = stats;
  },
};

const ascending = (a, b, key) => {
  if (a[key] < b[key]) return -1;
  if (a[key] > b[key]) return 1;
  return 0;
};

const descending = (a, b, key) => {
  if (a[key] > b[key]) return -1;
  if (a[key] < b[key]) return 1;
  return 0;
};

const getters = {
  quotesExpired: state => (limit = 5) => state.quotes
    .filter(q => q.status === 'expired')
    .sort((q1, q2) => ascending(q1, q2, 'createdAt'))
    .slice(0, limit),
  quotesNew: state => (limit = 5) => state.quotes
    .filter(q => q.status === 'new')
    .sort((q1, q2) => descending(q1, q2, 'createdAt'))
    .slice(0, limit),
  quotesPending: state => (limit = 5) => state.quotes
    .filter(q => q.status === 'pending')
    .sort((q1, q2) => ascending(q1, q2, 'createdAt'))
    .slice(0, limit),
  quotesInProcess: state => (limit = 5) => state.quotes
    .filter(q => q.status === 'inProcess')
    .sort((q1, q2) => ascending(q1, q2, 'createdAt'))
    .slice(0, limit),
  quotesInProduction: state => (limit = 5) => state.quotes
    .filter(q => q.status === 'inProduction')
    .sort((q1, q2) => ascending(q1, q2, 'createdAt'))
    .slice(0, limit),
  quotesShipped: state => (limit = 5) => state.quotes
    .filter(q => q.status === 'shipped')
    .sort((q1, q2) => descending(q1, q2, 'shipDate'))
    .slice(0, limit),
  // admin level stuff
  needVerifyBOM: state => (limit = 5) => state.dnvQuotes
    .filter(q => q.po && !q.trackingNumber && (!q.verify || !q.verify.bom))
    .sort((q1, q2) => ascending(q1, q2, 'createdAt'))
    .slice(0, limit),
  needVerifyMaterial: state => (limit = 5) => state.dnvQuotes
    .filter(q => !q.missed && !q.trackingNumber && (!q.verify || !q.verify.materials))
    .sort((q1, q2) => descending(q1, q2, 'createdAt'))
    .slice(0, limit),
};

const quotes = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default quotes;
