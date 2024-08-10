/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

import distService from './dist.service';

const defaultDist = {
  tag: '',
  name: '',
  pricing: 'LAMONS',
  phone: '',
  address: {
    line1: '',
    lien2: '',
  },
  logo: '',
};

const state = {
  status: { },
  distList: [],
  editDistTag: '',
  // TODO should pull from the list...
  editDist: defaultDist,
};

const actions = {
  async getDistList({ dispatch, commit }) {
    commit('SET_DIST_LIST_PENDING');
    try {
      const distList = await distService.getDistList();
      commit('SET_DIST_LIST', distList);
    }
    catch (err) {
      commit('SET_DIST_LIST_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async getDist({ dispatch, commit }, distID) {
    commit('SET_DIST_PENDING');
    try {
      const dist = await distService.getDist(distID);
      commit('SET_DIST_LIST', [dist]);
    }
    catch (err) {
      commit('SET_DIST_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async createDist({ dispatch, commit }, payload) {
    const { data } = payload;
    commit('SET_DIST_PENDING');
    try {
      const dist = await distService.createDist(data);
      commit('SET_DIST_LIST', [dist]);
      commit('SET_EDIT_DIST', { distTag: dist.tag, dist });
      dispatch('alert/success', { title: 'Distributer', message: 'Created' }, { root: true });
    }
    catch (err) {
      commit('SET_DIST_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async updateDist({ dispatch, commit }, payload) {
    const { data } = payload;
    commit('SET_DIST_PENDING');
    try {
      const dist = await distService.updateDist(data);
      commit('SET_DIST_LIST', [dist]);
      dispatch('alert/success', { title: `Distributer: ${dist.tag}`, message: 'Updated' }, { root: true });
    }
    catch (err) {
      commit('SET_DIST_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async setEditDist({ commit }, distTag) {
    // console.log(distTag)
    if (distTag === '') {
      commit('SET_EDIT_DIST', { distTag: '', dist: defaultDist });
    }
    else {
      const dist = await distService.getDist(distTag);
      commit('SET_EDIT_DIST', { distTag: dist.tag, dist });
    }
  },
  setDistStats({ commit }) {
    commit('SET_STATS');
  },
};

const mutations = {
  // dist list
  SET_DIST_LIST_PENDING(state) {
    state.status = { loadingList: true };
    state.distList = [];
  },
  SET_DIST_LIST(state, distList) {
    const { stats } = this.state.quotes;
    state.status = { };
    if (typeof distList !== 'string') {
      // eslint-disable-next-line no-restricted-syntax
      for (const dist of distList) {
        if (!dist.users) continue;
        const index = state.distList.findIndex(sq => sq.tag === dist.tag);
        dist.userCount = dist.users.length;
        const users = dist.users.map(u => u._id);
        if (users && stats) {
          const distQs = stats.filter(s => users.indexOf(s._id.user_id) !== -1);
          const { tc, tl, tp, yc, yl, yp } = distQs.reduce((acc, s) => {
            if (s._id.year > 2022) {
              acc.yc += s.count;
              acc.yl += s.totalList;
              acc.yp += s.totalPrice;
            }
            acc.tc += s.count;
            acc.tl += s.totalList;
            acc.tp += s.totalPrice;
            return acc;
          }, { tc: 0, tl: 0, tp: 0, yc: 0, yl: 0, yp: 0 });
          dist.quoteCount = yc;
          dist.quotePrice = yp;
          dist.quoteList = yl;
          dist.avgDiscount = yl ? Math.round((1 - yp / yl) * 100) : '';
          dist.quoteCountTOT = tc;
          dist.quotePriceTOT = tp;
          dist.quoteListTOT = tl;
          dist.avgDiscountTOT = tl ? Math.round((1 - tp / tl) * 100) : '';
        }
        if (index !== -1) state.distList.splice(index, 1, dist);
        else state.distList.push(dist);
      }
    }
  },
  SET_STATS(state) {
    const { stats } = this.state.quotes;
    for (const dist of state.distList) {
      if (!dist.users) continue;
      const index = state.distList.findIndex(sq => sq.tag === dist.tag);
      dist.userCount = dist.users.length;
      const users = dist.users.map(u => u._id);
      if (users && stats) {
        const distQs = stats.filter(s => users.indexOf(s._id.user_id) !== -1);
        const { tc, tl, tp, yc, yl, yp } = distQs.reduce((acc, s) => {
          if (s._id.year > 2022) {
            acc.yc += s.count;
            acc.yl += s.totalList;
            acc.yp += s.totalPrice;
          }
          acc.tc += s.count;
          acc.tl += s.totalList;
          acc.tp += s.totalPrice;
          return acc;
        }, { tc: 0, tl: 0, tp: 0, yc: 0, yl: 0, yp: 0 });
        dist.quoteCount = yc;
        dist.quotePrice = yp;
        dist.quoteList = yl;
        dist.avgDiscount = yl ? Math.round((1 - yp / yl) * 100) : '';
        dist.quoteCountTOT = tc;
        dist.quotePriceTOT = tp;
        dist.quoteListTOT = tl;
        dist.avgDiscountTOT = tl ? Math.round((1 - tp / tl) * 100) : '';
      }
      if (index !== -1) state.distList.splice(index, 1, dist);
      else state.distList.push(dist);
    }
  },
  SET_DIST_LIST_FAILED(state) {
    state.status = { error: true };
    // state.distList = [];
  },
  // single dist
  SET_DIST_PENDING(state) {
    state.status = { loading: true };
    state.dist = { defaults: {}, phone: {}, address: {} };
    state.newCredentials = null;
  },
  SET_DIST_FAILED(state) {
    state.status = { error: true };
  },
  SET_EDIT_DIST(state, { distTag, dist }) {
    state.editDistTag = distTag;
    state.editDist = dist;
  },
};

const getters = {
  distSelection: state => state.distList.map(dist => ({ value: dist.tag, text: dist.name })),
  distOnlySelection: state => state.distList
    .filter(dist => dist.pricing === 'DIST')
    .map(dist => ({ value: dist.tag, text: dist.name })),
  distPricing: state => tag => state.distList.find(dist => dist.tag === tag).pricing,
  distDetails: state => tag => state.distList.find(dist => dist.tag === tag),
};

const distList = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default distList;
