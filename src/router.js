/* eslint-disable no-undef */
import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

Vue.use(Router);

const routes = [
  // home route
  { path: '/', name: 'login', component: () => import('./views/Login.vue') },

  // user routes
  { path: '/user', name: 'user', component: () => import('./pages/User/User.vue') },
  { path: '/userpass', name: 'userpass', component: () => import('./pages/User/UserPasswordChange.vue') },
  { path: '/user/:user_id', name: 'userssettings', props: true, component: () => import('./pages/User/User.vue') },
  { path: '/users', name: 'users', component: () => import('./pages/User/Users.vue') },
  // { path: '/createuser', name: 'createUser', component: () => import('./pages/User/UserCreate.vue') },
  { path: '/priceSheets/:ps_id?', name: 'priceSheets',  props: true, component: () => import('./pages/PriceSheets/ps.vue') },

  // quote routes
  { path: '/quotes', name: 'quotes', component: () => import('./pages/Quotes/Quotes.vue') },
  { path: '/quotes/:user_id', name: 'usersquotes', props: true, component: () => import('./pages/Quotes/Quotes.vue') },

  // estimator routes
  { path: '/estimator', name: 'estimator', component: () => import('./pages/Quotes/Estimator.vue') },
  { path: '/estimator/:quote_id', name: 'loadquote', props: true, component: () => import('./pages/Quotes/Estimator.vue') },

  // print
  { path: '/p/:src/:_id?', name: 'print', props: true, component: () => import('./pages/PrintBook/Print.vue') },

  // dev routes
  { path: '/inv', name: 'inventory', component: () => import('./pages/DashInv/InvDash.vue') },
  { path: '/import', name: 'import', component: () => import('./views/Import.vue') },
  { path: '/dist', name: 'dist', component: () => import('./pages/Distributor/Dist.vue') },

  // production routes
  { path: '/o/:order_id?', name: 'order', component: () => import('./pages/Orders/O.vue'), props: true },
  { path: '/warroom/', name: 'warroom', component: () => import('./pages/WarRoom/WR.vue'), props: true },
  { path: '/og', name: 'ordersgantt', component: () => import('./pages/Orders/OrderGantt.vue') },
  { path: '/tp', name: 'TubesToPull', component: () => import('./pages/OrderTubesPull/TP.vue') },
  { path: '/s', name: 'Stats', component: () => import('./pages/Stats/stats.vue') },
  { path: '/nc', name: 'Non Conformance', component: () => import('./pages/NonConformance/NcPage.vue') },
  { path: '/labels', name: 'Labels', component: () => import('./pages/Labels/LabelPage.vue') },

  // other routes
  { path: '/bugreport', name: 'bugreport', component: () => import('./views/bugreport.vue') },
];

const router = new Router({
  // mode: 'history', // did not work... prop variables break the links...
  routes,
});

// eslint-disable-next-line consistent-return
router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/'];
  const authRequired = !publicPages.includes(to.path);
  const user = router.app.$store.getters['account/user'];

  if (user && user.changePass && to.path !== '/userpass') return next('/userpass');

  store.dispatch('account/authenticate').then(loggedIn => {
    if (authRequired && !loggedIn) return next('/');
    return next();
  }).catch(() => {
    next('/');
  });
});

export default router;
