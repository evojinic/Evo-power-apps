/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

import hbService from './hb.service';

// function displayFBStats (){
// 	for (var op in stats['lastMonth']){
// 		for (var stat in stats['lastMonth'][op]){
// 			var str = '';
// 			if ( stats['lastMonth'] && stats['lastMonth'][op] && stats['lastMonth'][op][stat] ){
// 				str += (stats['lastMonth'][op][stat]['val']/stats['lastMonth'][op][stat]['cnt']/60).toFixed(0) +' min<br>';
// 			}
// 			if ( stats['thisMonth'] && stats['thisMonth'][op] && stats['thisMonth'][op][stat] ){
// 				str += (stats['thisMonth'][op][stat]['val']/stats['thisMonth'][op][stat]['cnt']/60).toFixed(0) +' min';
// 			}
// 			document.getElementById( op+'-'+stat+'-stats' ).innerHTML = str;
// 		}
// 	}
// }

const state = {
  status: {},
  stats: {},
  list: [],
  item: {},
  op: '',
  stamp: '',
  // name: '',
  lastFetch: null,
  quotesWithPOs: [],
  quote: {},
  verifiedBOMs: [],
};

const actions = {
  async createHBQ({ dispatch, commit }, { data }) {
    if (data) {
      try {
        commit('SET_STATUS_KEY', 'saving');
        commit('SET_ITEM_LIST', [await hbService.create(data)]);
        commit('REMOVE_STATUS_KEY', 'saving');
        dispatch('alert/success', { title: 'Created', message: 'Home Board Quote' }, { root: true });
      }
      catch (err) {
        commit('REMOVE_STATUS_KEY', 'saving');
        dispatch('alert/error', err, { root: true });
      }
    }
  },
  async listHBQ({ commit, state }) {
    try {
      if (!state.lastFetch) commit('SET_ITEM_LIST', await hbService.list());
      else commit('SET_ITEM_LIST', await hbService.refresh(state.lastFetch.toJSON()));
    }
    catch (err) {
      console.error(err);
      // commit('SET_ITEM_FAILED', err);
      // dispatch('alert/error', err, { root: true });
    }
  },
  async getQuotesWithPOs({ commit }) {
    try {
      commit('SET_QUOTES_WITH_POs_LIST', await hbService.listWithPOs());
    }
    catch (err) {
      console.error(err);
      // commit('SET_ITEM_FAILED', err);
      // dispatch('alert/error', err, { root: true });
    }
  },
  async loadHBQ({ dispatch, commit }, payload) {
    if (!payload) {
      commit('CLEAR_ITEM');
    }
    else {
      const { hbq_id, op, stamp } = payload;
      state.op = op;
      state.stamp = stamp;
      if (hbq_id) {
        try {
          commit('SET_STATUS_KEY', 'loading');
          commit('SET_ITEM', await hbService.get(hbq_id));
          commit('REMOVE_STATUS_KEY', 'loading');
        }
        catch (err) {
          commit('REMOVE_STATUS_KEY', 'loading');
          dispatch('alert/error', err, { root: true });
        }
      }
    }
  },
  async moveStatusHBQ({ dispatch, commit, state, rootState }, { comments, noBOM, orderNum }) {
    let verified = true;
    const id = state.item._id;
    const { op, stamp } = state;

    // check if it is already done
    if (
      state.item.FB &&
      state.item.FB[op] &&
      state.item.FB[op][stamp]
    ) {
      verified = false;
      commit('CLEAR_ITEM');
      dispatch('alert/info', { title: 'No Action', message: 'Already Signed Off' }, { root: true });
    }

    if (!rootState.account) dispatch('alert/error', { title: 'No Action', message: 'no account found' }, { root: true });
    if (!rootState.account.user) dispatch('alert/error', { title: 'No Action', message: 'no account user found' }, { root: true });
    // let auth_id = rootState.account.user.displayName;
    const auth_id = rootState.account.user._id;
    const name = rootState.account.user._id;

    if (id && op && stamp && name && auth_id) {
      const data = {
        quote: id,
        name,
        op,
        stamp,
        comments,
      };

      if (op === 'oEntry' && stamp === 'stop') {
        if (noBOM) {
          data.noBOM = noBOM;
        }
        if (!orderNum) {
          verified = false;
          dispatch('alert/error', { title: 'Missing Data', message: 'Enter Order Number' }, { root: true });
        }
        else {
          data.orderNum = orderNum;
        }
      }

      if (verified) {
        try {
          data.moveStatus = true;
          commit('SET_STATUS_KEY', 'saving');
          commit('SET_ITEM', await hbService.update(id, data));
          commit('CLEAR_ITEM');
          if (op === 'oEntry' && stamp === 'stop' && auth_id) {
            // dispatch('quotes/getUsersQuotes', auth_id, { root: true });
            commit('SET_QUOTES_WITH_POs_LIST', await hbService.listWithPOs());
            // dispatch('getQuotesWithPOs'); was not working?
          }
          commit('REMOVE_STATUS_KEY', 'saving');
          dispatch('alert/success', { title: 'Status Updated', message: '' }, { root: true });
        }
        catch (err) {
          commit('REMOVE_STATUS_KEY', 'saving');
          dispatch('alert/error', err, { root: true });
        }
      }
    }
  },
  async updateHBQ({ dispatch, commit }, { hbq_id, data }) {
    if (hbq_id) {
      try {
        commit('SET_STATUS_KEY', 'saving');
        commit('SET_ITEM', await hbService.update(hbq_id, data));
        commit('REMOVE_STATUS_KEY', 'saving');
        dispatch('alert/success', { title: 'Updated', message: 'Home Board Quote' }, { root: true });
      }
      catch (err) {
        commit('REMOVE_STATUS_KEY', 'saving');
        dispatch('alert/error', err, { root: true });
      }
    }
  },
  // changeName({ commit }, name) {
  //   console.log(name);
  //   commit('SET_NAME', name);
  // },
  async getQuote({ commit, dispatch }, quote_id) {
    try {
      commit('SET_STATUS_KEY', 'loading_quote');
      commit('SET_QUOTE', await hbService.getQuote(quote_id));
      dispatch('verifyBOM');
    }
    catch (err) {
      // console.error(err);
      // commit('SET_ITEM_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
    commit('REMOVE_STATUS_KEY', 'loading_quote');
  },
  async clearQuote({ commit, dispatch }) {
    try {
      commit('SET_QUOTE', {});
      commit('VERIFY_BOM', []);
    }
    catch (err) {
      // console.error(err);
      // commit('SET_ITEM_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async verifyBOM({ dispatch, commit, state }) {
    try {
      commit('SET_STATUS_KEY', 'loading_verify');
      const data = state.quote.qItems;
      const quote = await hbService.verifyBOM(data);
      commit('VERIFY_BOM', quote);
      dispatch('alert/success', { title: quote._id, message: 'Verify BOM Data Received' }, { root: true });
    }
    catch (err) {
      dispatch('alert/error', err, { root: true });
    }
    commit('REMOVE_STATUS_KEY', 'loading_verify');
  },
};

const mutations = {
  SET_STATUS_KEY(state, load) {
    const status = { ...state.status };
    status[load] = true;
    state.status = status;
  },
  REMOVE_STATUS_KEY(state, load) {
    const status = { ...state.status };
    delete status[load];
    state.status = status;
  },
  SET_ITEM_LIST(state, list) {
    if (typeof list !== 'string') {
      for (const item of list) {
        const index = state.list.findIndex(li => li._id === item._id);
        if (index !== -1) state.list.splice(index, 1, item);
        else state.list.push(item);
      }
    }
    state.lastFetch = new Date();
  },
  SET_QUOTES_WITH_POs_LIST(state, list) {
    if (typeof list !== 'string') {
      state.quotesWithPOs = [];
      state.quotesWithPOs = list;
      // for (const item of list) {
      //   const index = state.quotesWithPOs.findIndex(i => i._id === item._id);
      //   if (index !== -1) state.quotesWithPOs.splice(index, 1, item);
      //   else state.quotesWithPOs.push(item);
      // }
    }
  },
  SET_ITEM(state, item) {
    // console.log(item);
    if (typeof item !== 'string') {
      state.item = { ...item };
      if (item._id) {
        // update the list
        const index = state.list.findIndex(li => li._id === item._id);
        if (index !== -1) state.list.splice(index, 1, item);
        else state.list.push(item);
      }
    }
  },
  SET_QUOTE(state, payload) {
    state.quote = { ...payload };
  },
  VERIFY_BOM(state, verify) {
    state.verifiedBOMs = verify;
  },
  CLEAR_ITEM(state) {
    state.item = {};
    state.op = '';
    state.stamp = '';
  },
  SET_NAME(state, name) {
    state.name = name;
  },
};

const getters = {
  status: state => state.status,
  oEntryWIP: state => state.list.filter(hbq => hbq.FB.oEntry && hbq.FB.oEntry.start && !hbq.FB.oEntry.stop),

  oVerifyQUE: state => state.list.filter(hbq => hbq.FB.oVerify && !hbq.FB.oVerify.start && hbq.FB.oEntry && hbq.FB.oEntry.stop),
  oVerifyWIP: state => state.list.filter(hbq => hbq.FB.oVerify && !hbq.FB.oVerify.stop && hbq.FB.oVerify.start),

  oBomQUE: state => state.list.filter(hbq => hbq.FB.oBOM && !hbq.FB.oBOM.start && hbq.FB.oEntry && hbq.FB.oEntry.stop),
  oBomWIP: state => state.list.filter(hbq => hbq.FB.oBOM && !hbq.FB.oBOM.stop && hbq.FB.oBOM.start),

  oReleaseQUE: state => state.list.filter(hbq => hbq.FB.oRelease && !hbq.FB.oRelease.start &&
    (
      hbq.FB.oVerify && hbq.FB.oVerify.stop ||
      hbq.FB.oBOM && hbq.FB.oBOM.stop ||
      !hbq.FB.oVerify && !hbq.FB.oBOM
    )),

  oEntryQuote: state => state.quote,
  verifiedBOMs: state => state.verifiedBOMs,
  selectedHBQ: state => state.item,

  oStuffingQUE: state => state.list.filter(hbq => hbq.FB.oStuffing && !hbq.FB.oStuffing.start && hbq.FB.oRelease && hbq.FB.oRelease.start),
  oStuffingWIP: state => state.list.filter(hbq => hbq.FB.oStuffing && !hbq.FB.oStuffing.stop && hbq.FB.oStuffing.start),

  oDistributionQUE: state => state.list.filter(hbq => hbq.FB.oDistribution && !hbq.FB.oDistribution.start && hbq.FB.oStuffing && hbq.FB.oStuffing.stop),

  quotesWithPOs: state => state.quotesWithPOs,
};

const orders = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default orders;
