import Vue from 'vue';
import Vuex from 'vuex';

import account from './pages/User/auth.module';
import users from './pages/User/user.module';
import ps from './pages/PriceSheets/ps.module';
import dist from './pages/Distributor/dist.module';
import orders from './pages/Orders/orders.module';
import tp from './pages/OrderTubesPull/tp.module';
import s from './pages/Stats/stats.module';
// import ws from './pages/OrderWorkSheets/ws.module';

import hb from './components/HomeBoard/hb.module';
import alert from './_modules/alert.module';
import quotes from './pages/Quotes/quotes.module';
import quote from './pages/Quotes/quote.module';
import inv from './_modules/inv.module';
import dp from './_modules/dp.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    alert,
    account,
    users,
    quotes,
    quote,
    inv,
    dp,
    tp,
    ps,
    s,
    hb,
    dist,
    orders,
  },
  // state: {},
  // getters: {},
  // mutations: {},
  // plugins: [],
});
