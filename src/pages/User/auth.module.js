/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */

import userService from './user.service';
// import { router } from '../_helpers';
import router from '../../router';

const user = JSON.parse(localStorage.getItem('user'));

const state = user ?
  { status: { loggedIn: true }, token: user.token, user: user.payload, criticalError: '' } :
  { status: { loggedOut: true }, token: null, user: null };

const actions = {
  login({ dispatch, commit }, { username, password }) {
    commit('LOGIN_REQUEST', { username });
    userService.login(username, password)
      .then(
        user => {
          commit('LOGIN_SUCCESS', user);
          router.push('/estimator');
        },
        error => {
          commit('LOGIN_FAILED', error);
          dispatch('alert/error', error, { root: true });
        },
      );
  },
  authenticate({ state }) {
    if (state.token) return true;
    return false;
  },
  logout({ commit }) {
    userService.logout();
    commit('LOGOUT_REQUEST');
    router.push('/');
  },
  aError({ commit }, payload) {
    commit('CRITICAL_ERROR', payload);
  },
  autoLogout({ commit }) {
    userService.logout();
    commit('LOGOUT_REQUEST');
    router.push('/');
  },
  // authUserUpdate({ commit, state }, payload) {
  //   if (state.user._id === payload._id) commit('UPDATE_AUTH_USER', payload);
  // }
};

const mutations = {
  LOGIN_REQUEST(state, user) {
    state.status = { loginPending: true };
    state.user = user;
  },
  LOGIN_SUCCESS(state, user) {
    state.status = { loggedIn: true };
    state.token = user.token;
    state.user = user.payload;
    if (!state.user.roles) state.user.roles = [];
  },
  LOGIN_FAILED(state) {
    state.status = { loggedOut: true };
    state.token = null;
    state.user = {};
  },
  LOGOUT_REQUEST(state) {
    state.status = { loggedOut: true };
    state.token = null;
    state.user = {};
  },
  // UPDATE_AUTH_USER(state, payload) {
  //   console.log(payload)
  //   state.user = payload;
  // },
  CRITICAL_ERROR(state, payload) {
    // console.log(payload);
    state.criticalError = payload.response.data;
    // console.log(state.criticalError);
  },
};

const getters = {
  user: state => state.user,
  status: state => state.status,
  isAdmin: state => state.user.roles && (state.user.roles.indexOf('ADMIN') !== -1 || state.user.roles.indexOf('DEV') !== -1),
  isDev: state => state.user.roles && state.user.roles.indexOf('DEV') !== -1,
  isDnv: state => state.user.dist && state.user.dist === 'DNV',
  roleMRB: state => state.user.roles && state.user.roles.indexOf('BOM') !== -1,
  roleBOM: state => state.user.roles && state.user.roles.indexOf('BOM') !== -1,
  roleINV: state => state.user.roles && state.user.roles.indexOf('INV') !== -1,
  roleUsers: state => state.user.roles && (state.user.roles.indexOf('USERS') !== -1 || state.user.roles.indexOf('DEV') !== -1),
  rolePS: state => state.user.roles && (state.user.roles.indexOf('PS') !== -1 || state.user.roles.indexOf('DEV') !== -1),
  roleOrders: state => state.user.roles && (state.user.roles.indexOf('ORDERS') !== -1 || state.user.roles.indexOf('DEV') !== -1),
  priceAdmin: state => state.user.pricing && state.user.pricing.indexOf('ADMIN') !== -1,
  priceDist: state => state.user.pricing && state.user.pricing.indexOf('DIST') !== -1,
  distDNV: state => state.user.pricing && state.user.dist === 'DNV',
  userName: state => state.user.displayName,
  auth_id: state => state.user._id,
};

const account = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default account;
