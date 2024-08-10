/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

import tpService from './tp.service';

const state = {
  status: {},
  tp: {},
  tpRAW: [],
  tpList: [],
  name: '',
};

const actions = {
  async listTP({ dispatch, commit }) {
    try {
      commit('SET_TP_LIST', await tpService.get('list'));
    }
    catch (err) {
      commit('SET_TP_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async fetchTP({ dispatch, commit }) {
    try {
      commit('SET_TP_KEY_PENDING', 'generating');
      const gtp = await tpService.generate();
      if (gtp && gtp._id) commit('SET_TP', gtp);
      else commit('SET_TP_RAW', gtp);
      commit('SET_TP_KEY_DONE', 'generating');
      dispatch('alert/success', { title: 'Data Received', message: 'Tubes To Pull' }, { root: true });
    }
    catch (err) {
      commit('SET_TP_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async loadTempTP({ commit }, { tp }) {
    // if (tp) {
    try {
      commit('SET_TP_KEY_PENDING', 'new');
      commit('SET_TP', tp);
      commit('SET_TP_KEY_DONE', 'new');
    }
    catch (err) {
      console.log(err);
      // commit('SET_TP_FAILED', err);
      // dispatch('alert/error', err, { root: true });
    }
    // }
  },
  async loadTP({ dispatch, commit }, { tp_id }) {
    if (tp_id) {
      try {
        commit('SET_TP_KEY_PENDING', tp_id);
        commit('SET_TP', await tpService.get(tp_id));
        commit('SET_TP_KEY_DONE', tp_id);
        dispatch('alert/success', { title: 'Loaded', message: 'Tubes To Pull' }, { root: true });
      }
      catch (err) {
        commit('SET_TP_FAILED', err);
        dispatch('alert/error', err, { root: true });
      }
    }
  },
  async createTP({ dispatch, commit, state }, { data }) {
    if (data) {
      try {
        if (state.name) {
          data.log = [{
            name: state.name,
            stamp: data.stamp,
            action: 'created',
          }];
          commit('SET_TP_KEY_PENDING', 'saving');
          commit('SET_TP', await tpService.create(data));
          commit('SET_TP_KEY_DONE', 'saving');
          dispatch('alert/success', { title: 'Created', message: 'Tubes To Pull' }, { root: true });
        }
        else {
          dispatch('alert/error', { title: 'Could Not Create', message: 'Missing Name' }, { root: true });
        }
      }
      catch (err) {
        commit('SET_TP_FAILED', err);
        dispatch('alert/error', err, { root: true });
      }
    }
  },
  async moveStatus({ dispatch, commit }, { tp_id, name, tp }) {
    if (tp_id) {
      try {
        const data = tp;
        data.moveStatus = name;
        commit('SET_TP_KEY_PENDING', 'saving');
        commit('SET_TP', await tpService.update(tp_id, data));
        commit('SET_TP_KEY_DONE', 'saving');
        dispatch('alert/success', { title: 'Saved', message: 'Tubes To Pull' }, { root: true });
      }
      catch (err) {
        commit('SET_TP_FAILED', err);
        dispatch('alert/error', err, { root: true });
      }
    }
  },
  async updateTP({ dispatch, commit }, { tp_id, data }) {
    if (tp_id) {
      try {
        commit('SET_TP_KEY_PENDING', 'saving');
        commit('SET_TP', await tpService.update(tp_id, data));
        commit('SET_TP_KEY_DONE', 'saving');
        dispatch('alert/success', { title: 'Saved', message: 'Tubes To Pull' }, { root: true });
      }
      catch (err) {
        commit('SET_TP_FAILED', err);
        dispatch('alert/error', err, { root: true });
      }
    }
  },
  changeName({ commit }, name) {
    commit('SET_NAME', name);
  },
};

const mutations = {
  SET_TP_KEY_PENDING(state, load) {
    const status = { ...state.status };
    status[`loading_${load}`] = true;
    state.status = status;
  },
  SET_TP_KEY_DONE(state, load) {
    const status = { ...state.status };
    delete status[`loading_${load}`];
    state.status = status;
  },
  SET_TP_LIST(state, tpList) {
    // console.log(tpList);
    if (typeof tpList !== 'string') {
      // eslint-disable-next-line no-restricted-syntax
      for (const tp of tpList) {
        const index = state.tpList.findIndex(sq => sq._id === tp._id);
        // console.log(index);
        if (index !== -1) state.tpList.splice(index, 1, tp);
        else state.tpList.push(tp);
      }
    }
  },
  SET_TP_RAW(state, tpRAW) {
    if (typeof tpRAW !== 'string') {
      state.tpRAW = tpRAW.sort((t1, t2) => {
        if (t1.mat > t2.mat) return 1;
        if (t1.mat < t2.mat) return -1;
        if (t1.due > t2.due) return 1;
        if (t1.due < t2.due) return -1;
        return 0;
      });
    }
  },
  SET_TP(state, tp) {
    // console.log(tp);
    if (typeof tp !== 'string') {
      state.tp = { ...tp };
      if (tp._id) {
        const noTubeData = {
          _id: tp._id,
          stamp: tp.stamp,
          status: tp.status,
          comment: tp.comment,
        };
        // update the list
        const index = state.tpList.findIndex(sq => sq._id === noTubeData._id);
        if (index !== -1) state.tpList.splice(index, 1, noTubeData);
        else state.tpList.unshift(noTubeData);
      }
    }
  },
  SET_TP_FAILED(state, error) {
    console.log(error);
    state.tpsError = {
      status: error.response.status,
      message: error.response.data,
    };
  },
  SET_NAME(state, name) {
    state.name = name;
  },
};

const getters = {
  // tpsExpired: state => (limit = 5) => state.tps
  //   .filter(q => q.status === 'expired')
  //   .sort((q1, q2) => ascending(q1, q2, 'createdAt'))
  //   .slice(0, limit),
  // tpsNew: state => (limit = 5) => state.tps
  //   .filter(q => q.status === 'new')
  //   .sort((q1, q2) => descending(q1, q2, 'createdAt'))
  //   .slice(0, limit),
};

const tps = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default tps;
