/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

import userService from './user.service';
// import router from '../router';

const defaultSettings = {
  product: 'ik_kit',
  advanceOptions: false,
  quoteSaved: 'stay',
};
const defaultPhone = {
  primary: '+1-713-222-0284',
  alternative: '+1-713-222-0284',
};
const defaultAddress = {
  line1: '7300 Airport Blvd',
  line2: 'Houston, TX 77061, U.S.A.',
};

const state = {
  newCredentials: null,
  status: {
    isCurUserPending: false,
  },
  userList: [],
  curUser_id: '',
  passChange: {
    success: false,
    error: '',
  },
  roles: [
    { value: '', text: 'loading...' },
  ],
};

// const user = JSON.parse(localStorage.getItem('user'));

// const state = user
//   ? { status: { loggedIn: true }, token: user.token, user: user.payload }
//   : { status: { loggedOut: true }, token: null, user: null };

const actions = {
  async getAllUsers({ dispatch, commit }) {
    try {
      commit('SET_USERS_PENDING');
      const users = await userService.getAllUsers();
      commit('SET_USERS', users);
    }
    catch (err) {
      commit('SET_USERS_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async listRoles({ dispatch, commit }) {
    try {
      const roles = await userService.listRoles();
      commit('SET_ROLES_LIST', roles);
    }
    catch (err) {
      dispatch('alert/error', err, { root: true });
    }
  },
  setCurUser_id({ commit }, user_id) {
    if (user_id) {
      commit('SET_USER_ID', user_id);
    }
  },
  async getUser({ dispatch, commit }, user_id) {
    try {
      if (!user_id) {
        commit('SET_USER_PENDING');
        commit('SET_USER_ID', '');
      }
      else {
        commit('SET_USER_PENDING');
        const user = await userService.getUser(user_id);
        commit('SET_USER_ID', user._id);
        commit('SET_USERS', [user]);
      }
    }
    catch (err) {
      commit('SET_USER_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async updateUser({ dispatch, commit }, payload) {
    try {
      const { data } = payload;
      commit('SET_USER_PENDING');
      const user = await userService.updateUser(data._id, data);
      commit('SET_USER_ID', user._id);
      commit('SET_USERS', [user]);
      dispatch('alert/success', { title: user.username, message: 'User Setting Updated' }, { root: true });
      if (data.oldPassword) commit('USER_PASSWORD_CHANGE');
      // dispatch('account/authUserUpdate', user, { root: true });
    }
    catch (err) {
      commit('SET_USER_FAILED', err);
      if (err.response.data !== 'The credentials do not match.') {
        dispatch('alert/error', err, { root: true });
      }
    }
  },
  async createUser({ dispatch, commit }, payload) {
    try {
      const { data } = payload;
      commit('SET_USER_PENDING');
      const user = await userService.createUser(data);
      commit('SET_USER_ID', user._id);
      commit('SET_USERS', [user]);
      commit('USER_PASSWORD_REST', user);
      dispatch('alert/success', { title: user.username, message: 'User Created' }, { root: true });
    }
    catch (err) {
      commit('SET_USER_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async passwordReset({ dispatch, commit }, payload) {
    try {
      const { user_id } = payload;
      commit('SET_USER_PENDING');
      const user = await userService.passwordReset(user_id);
      commit('USER_PASSWORD_REST', user);
      dispatch('alert/success', { message: 'User Setting Updated' }, { root: true });
    }
    catch (err) {
      commit('SET_USER_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
};

const mutations = {
  // user list
  SET_USERS_PENDING(state) {
    state.status = { loading: true };
    // state.userList = [];
  },
  SET_USERS(state, users) {
    state.status = { };
    state.passChange = {
      success: false,
      error: '',
    };
    const { stats } = this.state.quotes;
    if (typeof users !== 'string') {
      // eslint-disable-next-line no-restricted-syntax
      for (const user of users) {
        const index = state.userList.findIndex(sq => sq._id === user._id);
        if (user && stats) {
          const userStats = stats.filter(s => user._id === s._id.user_id);
          // console.log(userStats)
          const { tc, tl, tp, yc, yl, yp } = userStats.reduce((t, s) => {
            if (s._id.year > 2022) {
              t.yc += s.count;
              t.yl += s.totalList;
              t.yp += s.totalPrice;
            }
            t.tc += s.count;
            t.tl += s.totalList;
            t.tp += s.totalPrice;
            return t;
          }, { tc: 0, tl: 0, tp: 0, yc: 0, yl: 0, yp: 0 });
          user.stats = userStats;
          user.quoteCountTOT = tc;
          user.quotePriceTOT = tp;
          user.quoteListTOT = tl;
          user.avgDiscountTOT = tl ? Math.round((1 - tp / tl) * 100) : '';
          user.quoteCount = yc;
          user.quotePrice = yp;
          user.quoteList = yl;
          user.avgDiscount = yl ? Math.round((1 - yp / yl) * 100) : '';
        }
        if (index !== -1) state.userList.splice(index, 1, user);
        else state.userList.push(user);
      }
    }
  },
  SET_USERS_FAILED(state) {
    state.status = { error: true };
    // state.users = [];
  },
  // single user
  SET_USER_PENDING(state) {
    state.status = { isCurUserPending: true };
    // state.curUser_id = '';
    state.newCredentials = null;
  },
  SET_USER_ID(state, user_id) {
    // console.log('user_id', user_id)
    state.status.isCurUserPending = false;
    state.curUser_id = user_id;
    state.newCredentials = null;
  },
  SET_USER_FAILED(state, error) {
    if (error.response.data === 'The credentials do not match.') {
      state.passChange.error = error.response.data;
      state.status = { error: true };
    }
    else state.status = { error: true };
    state.newCredentials = null;
  },
  USER_PASSWORD_CHANGE(state) {
    state.passChange.success = true;
  },
  USER_PASSWORD_REST(state, user) {
    state.status = { loaded: true };
    state.newCredentials = user;
  },
  SET_ROLES_LIST(state, roles) {
    if (state.roles.length === 1) state.roles.splice(0, 1);
    if (typeof roles !== 'string') {
      for (const i of roles) {
        const index = state.roles.findIndex(sq => sq.value === i.value);
        if (index !== -1) state.roles.splice(index, 1, i);
        else state.roles.push(i);
      }
    }
  },
};

const getters = {
  status: state => state.status,
  userList: state => state.userList,
  curUser_id: state => state.curUser_id,
  newCredentials: state => state.newCredentials,
  passChange: state => state.passChange,
  curUser: state => {
    let user = state.userList.find(user => user._id === state.curUser_id);
    // add missing data...
    if (!user) {
      user = {
        userName: '',
        displayName: '',
        dist: '',
        // password: '',
        // pricing: 'LAMONS',
        status: 'active',
        // phone: defaultPhone,
        // address: defaultAddress,
      };
    }
    if (user._id && typeof user.defaults === 'undefined') user.defaults = defaultSettings;
    if (typeof user.phone === 'undefined') user.phone = defaultPhone;
    if (typeof user.address === 'undefined') user.address = defaultAddress;
    if (typeof user.status === 'undefined') user.status = '';
    if (typeof user.pricing === 'undefined') user.pricing = '';
    // console.log('user', user);
    return user;
  },
  getUser: state => user_id => state.userList.find(user => user._id === user_id),
  rolesList: state => state.roles,
};

const users = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default users;
