/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

const state = {
  type: null,
  title: null,
  message: null,
  actions: null,
};

const actions = {
  success({ commit }, payload) {
    commit('success', payload);
    setTimeout(() => commit('clear'), 3000);
  },
  info({ commit }, payload) {
    commit('info', payload);
    setTimeout(() => commit('clear'), 3000);
  },
  // notice({ commit }, payload) {
  //   commit('notice', payload);
  //   setTimeout(() => commit('clear'), 3000);
  // },
  error({ commit, dispatch }, err) {
    if (err.response && err.response.status === 401) {
      dispatch('account/aError', err, { root: true });
      dispatch('account/autoLogout', err, { root: true });
    }
    if (err.response && err.response.status === 304) {
      commit('success', { message: 'looks up to date', title: '304 - No Change' });
      setTimeout(() => commit('clear'), 3000);
    }
    else {
      commit('error', err);
      setTimeout(() => commit('clear'), 12000);
    }
  },
  clear({ commit }) {
    commit('clear');
  },
};

const mutations = {
  success(state, payload) {
    // console.log('alert-success', payload);
    const { title, message, actions } = payload;
    state.type = 'success';
    if (message) state.message = message;
    if (title) state.title = title;
    if (actions) state.actions = actions;
  },
  warning(state, payload) {
    const { title, message, actions } = payload;
    state.type = 'warning';
    if (message) state.message = message;
    if (title) state.title = title;
    if (actions) state.actions = actions;
  },
  info(state, payload) {
    // console.log('alert-info', payload);
    const { title, message, actions } = payload;
    state.type = 'info';
    if (message) state.message = message;
    if (title) state.title = title;
    if (actions) state.actions = actions;
  },
  error(state, err) {
    // console.log('alert-err', err);
    state.type = 'error';
    let msg = err;
    // console.log(err);
    // if (!msg.response) msg = 'you or the server is offline';
    if (msg.response) msg = msg.response;
    if (msg.data) {
      state.title = msg.data;
      state.message = err;
    }
    else state.message = msg;
    const { title, message, actions } = err;
    if (message) state.message = message;
    if (title) state.title = title;
    if (actions) state.actions = actions;
  },
  clear(state) {
    // console.log('alert-clear');
    state.type = null;
    state.title = null;
    state.message = null;
    state.actions = null;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
