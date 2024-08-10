/* eslint-disable no-underscore-dangle */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

import quoteService from './quotes.service';
import itemService from '../../_modules/item.service';
// import slider from './slider.module';

const validWMPromoSet = ({ sleeveM, isoWasher, retWasher }) =>
  ['G10', 'G10CH'].indexOf(isoWasher) !== -1 &&
  ['G10', 'M'].indexOf(sleeveM) !== -1 &&
  ['Z', 'ZCH', '316L', 'S304'].indexOf(retWasher) !== -1;

const validWMPromoGasket = ({ brand, retMat, seal }) => {
  if (brand === 'IG') {
    if (retMat === 'G10' && seal === 'E') return true;
    if (retMat === 'PWQ' && ['E', 'TM'].indexOf(seal) !== -1) return true;
    if (retMat === 'G10PW' && ['E', 'TM'].indexOf(seal) !== -1) return true;
  }
  if (brand === 'LS' && ['L441', 'L420'].indexOf(retMat) !== -1) return true;
  if (brand === 'MS' && ['L100', 'L104', 'L110'].indexOf(retMat) !== -1) return true;
  return false;
};
const waterMarketPromo = ({ brand, retMat, seal, sleeveM, isoWasher, retWasher }) => {
  if (sleeveM || isoWasher || retWasher) {
    if (!validWMPromoSet({ sleeveM, isoWasher, retWasher })) return false;
  }
  if (!validWMPromoGasket({ brand, retMat, seal })) return false;
  return true;
};

const qtyIncrement = ({ product, boltSize, sleeveM }) => {
  if (product === 'isoTube') {
    if (sleeveM === 'MM') return 3;
    if (isNaN(boltSize)) return 3.28;
    return 6;
  }
  return 1;
};

// const sliderRes = 10000;
// average calculator
const brandKeyPercentAverage = (arr, sliderRes) => {
  if (arr.length === 0) return 0;
  const total = arr.reduce((tot, val) => tot + val, 0);
  return Math.round(total / arr.length * sliderRes) / sliderRes;
};

const brandKeyPercentArray = (key, brandCostList) => {
  const refKey = 'al';
  // use the total to calculate the weight
  return brandCostList.reduce((arr, cost) => {
    if (!cost || !cost[key] || !cost[refKey]) return arr;
    const num = cost[key] - cost[refKey];
    const den = cost.mh - cost[refKey];
    // skip flipped number
    if (num >= 0 && den > 0) arr.push(num / den);
    return arr;
  }, []);
};

const brandAverages = (brandCostList, sliderRes) => {
  const avg = {};
  avg.lp = brandKeyPercentAverage(brandKeyPercentArray('lp', brandCostList), sliderRes);
  avg.sp = brandKeyPercentAverage(brandKeyPercentArray('sp', brandCostList), sliderRes);
  avg.ms = brandKeyPercentAverage(brandKeyPercentArray('ms', brandCostList), sliderRes);
  // avg.mh = brandKeyPercentAverage(brandKeyPercentArray('mh', brandCostList), sliderRes);
  // avg.ml = brandKeyPercentAverage(brandKeyPercentArray('ml', brandCostList), sliderRes);
  // avg.ms = brandKeyPercentAverage(brandKeyPercentArray('ms', brandCostList), sliderRes);
  // avg.dml = brandKeyPercentAverage(brandKeyPercentArray('dml', brandCostList), sliderRes);
  // avg.mg = brandKeyPercentAverage(brandKeyPercentArray('mg', brandCostList), sliderRes);
  return avg;
};

const setSliderClcVal = sliderData => {
  const sliderAvg = sliderData.avg;
  let markerAtValue = 1;
  let adminLimit = false;
  if (sliderData.admin >= 0) {
    markerAtValue = sliderData.admin;
    adminLimit = true;
  }
  else markerAtValue = sliderData.value;
  // adjust to the scale of the slider
  markerAtValue /= sliderData.resolution;
  // console.log(sliderAvg)

  let markerIsAfterKey = 'al';
  let markerAfterValue = 0;
  let markerIsBeforeKey = 'mh';
  let markerBeforeValue = 1;
  if (adminLimit === false) {
    markerIsAfterKey = 'ms';
    markerAfterValue = sliderAvg.ms;
  }

  // find all of the break points that are greater than the avg
  const keys = Object.keys(sliderAvg);
  for (const key of keys) {
    // ignore market low with 30 discount
    // if (key === 'dml') continue;
    // if (key === 'ms') continue;
    // margin goal no longer relevant
    // if ( key === 'mg' ) continue;
    const value = sliderAvg[key];
    // set average range staring point
    if (value <= markerAtValue && value > markerAfterValue) {
      markerIsAfterKey = key;
      markerAfterValue = value;
    }
    // set average range end point
    if (value > markerAtValue && value < markerBeforeValue && value > markerAfterValue) {
      markerIsBeforeKey = key;
      markerBeforeValue = value;
    }
    // console.log(markerAtValue, key, value)
  }

  //
  let markerAtAndStartValueRange = markerAtValue - markerAfterValue;
  let rangeBetweenKeys = markerBeforeValue - markerAfterValue;
  // price limited offset
  if (adminLimit === false && markerIsAfterKey === 'ms') {
    markerAtAndStartValueRange += sliderAvg.ms;
    rangeBetweenKeys += sliderAvg.ms;
  }

  // console.log(markerAtAndStartValueRange, rangeBetweenKeys)
  return {
    start: markerIsAfterKey,
    end: markerIsBeforeKey,
    percent: markerAtAndStartValueRange / rangeBetweenKeys || 0,
  };
};

// default quote
const quoteModel = {
  dist: '',
  qItems: [],
  qSliders: [],
  qData: {
    customer: '',
    job: '',
    expedite: false,
    priceNet: 0,
    priceList: 0,
    discount: 0,
    weightNet: 0,
    volumeNet: 0,
    boltsOnSide: 'S',
  },
  verifiedMaterials: [],
  status: 'notSaved',
};

let currentQuote = JSON.parse(JSON.stringify(quoteModel));

const state = {
  status: { },
  lineStatus: {},
  quote: currentQuote,
  sliderAvg: {},
  sliderClc: {},
  verifiedBOMs: [],
  canSave: false,
  loading: false,
  isSliderPending: false,
  isGetPending: false,
  isUpdatePending: false,
  quoteError: false,
  fastenersFor: ['ik_gasket', 'ik_kit', 'ik_swSet', 'gasket_kamm', 'gasket_sw'],
};
// const quote = JSON.parse(localStorage.getItem('quote'));

// const state = quote
//   ? { status: { loggedIn: true }, token: quote.token, quote: quote.payload }
//   : { status: { loggedOut: true }, token: null, quote: null };

const actions = {
  async getQuote({ dispatch, commit, state }, quoteID) {
    try {
      if (quoteID === 'new' || state.quote._id === quoteID) {
        // do nothing
      }
      else if (quoteID === 'clear' || !quoteID) {
        currentQuote = JSON.parse(JSON.stringify(quoteModel));
        commit('SET_QUOTE', currentQuote);
      }
      else {
        commit('SET_QUOTE_PENDING');
        const q = await quoteService.get(quoteID);
        q.qItems = q.qItems.map(item => {
          if (!item.pack) item.pack = [];
          if (!item.fasteners) item.fasteners = {};
          return item;
        });
        commit('SET_QUOTE', q);
        commit('SET_SLIDERS');
        commit('SET_LINE_NUMBERS');
        commit('UPDATE_QD_TOTALS_and_DISCOUNT');
        q.qItems.forEach((item, index) => {
          if (item.pack.length === 0) dispatch('lookItemWeight', { index, item });
          if (!item.fasteners.pn) dispatch('makeSugFastener', { index, item });
        });
      }
    }
    catch (err) {
      commit('SET_QUOTE_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async createQuote({ dispatch, commit }, payload) {
    try {
      const { data } = payload;
      // console.log(data);
      commit('UPDATE_QUOTE_PENDING');
      const quote = await quoteService.create(data);
      commit('SET_QUOTE', quote);
      dispatch('alert/success', { title: quote._id, message: 'Quote Saved / Created' }, { root: true });
      currentQuote = JSON.parse(JSON.stringify(quoteModel));
    }
    catch (err) {
      commit('SET_QUOTE_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async updateQuote({ dispatch, commit }, payload) {
    try {
      const { data } = payload;
      // console.log(data);
      commit('UPDATE_QUOTE_PENDING');
      const quote = await quoteService.update(data._id, data);
      commit('SET_QUOTE', quote);
      commit('SET_LINE_NUMBERS');
      dispatch('alert/success', { title: quote._id, message: 'Quote Saved / Updated' }, { root: true });
      dispatch('quotes/setQuote', quote, { root: true });
      // dispatch('quotes/updateList', 'verifyMaterials', { root: true });
    }
    catch (err) {
      commit('SET_QUOTE_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async verifyBOM({ dispatch, commit, state }) {
    try {
      const data = state.quote.qItems;
      commit('VERIFY_PENDING');
      const quote = await quoteService.verifyBOM(data);
      commit('VERIFY_BOM', quote);
      dispatch('alert/success', { title: quote._id, message: 'Verify BOM Data Received' }, { root: true });
    }
    catch (err) {
      commit('SET_QUOTE_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async verifyMaterial({ dispatch, commit, state }) {
    try {
      if (!state.quote.verifiedMaterials || state.quote.verifiedMaterials.length === 0) {
        const data = state.quote.qItems;
        commit('VERIFY_PENDING');
        const quote = await quoteService.verifyMaterial(data);
        commit('VERIFY_MATERIAL', quote);
        dispatch('alert/success', { title: quote._id, message: 'Verify Material Data Received' }, { root: true });
      }
    }
    catch (err) {
      commit('SET_QUOTE_FAILED', err);
      dispatch('alert/error', err, { root: true });
    }
  },
  async addItem({ dispatch, commit, state }, payload) {
    try {
      let { index, query, qty, o = {} } = payload;
      // query.dist = state.quote.dist;
      // query = encodeURIComponent(JSON.stringify(query));
      const qItems = [...state.quote.qItems];
      let item = {
        pn: '... loading ...',
        q: {},
      };
      // ensure things get added in proper order
      if (index === undefined) {
        // set blank place holder
        index = qItems.length;
      }
      else {
        // eslint-disable-next-line prefer-destructuring
        qty = qty || qItems[index].qty;
        item = {
          pn: '... updating ...',
          q: {},
          qty,
        };
      }

      let options = `dist=${state.quote.dist}`;
      if (o.updateBOM) options += '&updateBOM=1';
      if (o.updatePrice) options += '&updatePrice=1';
      // console.log(query)
      commit('SET_ITEM_PENDING', { index, item });
      if (query.product === 'charge') item = { pn: query.pn, desc: query.desc, q: query, p: { up: query.up } };
      else if (query.product === 'custom') item = { pn: query.pn, desc: query.desc, q: query, p: { up: query.up } };
      else item = await itemService.getItem(encodeURIComponent(JSON.stringify(query)), `?${options}`);
      if (!item.pack) item.pack = [];
      if (item.fasteners) item.fasteners.state = state.quote.qData.boltsOnSide || 'S';
      commit('SET_ITEM', { index, item, qty });
      dispatch('lookItemWeight', { index, item, qty });
      if (!item.fasteners) {
        item.fasteners = {};
        dispatch('makeSugFastener', { index, item, qty });
      }
      if (o.updateBOM) {
        const itemList = [item];
        const singleVerfify = await quoteService.verifyBOM(itemList);
        commit('SET_ITEM_VERIFY', { index, item: singleVerfify[0], qty });
      }
      commit('SET_SLIDERS');
      // commit('SET_ITEM_UNIT_PRICE', index);
      for (const index in state.quote.qItems) {
        commit('SET_ITEM_UNIT_PRICE', index);
      }
      commit('UPDATE_QD_TOTALS_and_DISCOUNT');
      dispatch('alert/success', { title: `ADDED Line: ${index + 1}`, message: item.pn }, { root: true });
    }
    catch (err) {
      dispatch('alert/error', err, { root: true });
    }
  },
  async lookItemWeight({ commit }, { index, item }) {
    if (!item || !item.pn) return;
    try {
      commit('SET_ITEM_WEIGHT', { index, pack: [{ loading: true }] });
      const list = await itemService.getPackFromList({ list: [item] });
      if (list) {
        commit('SET_ITEM_WEIGHT', { index, pack: list[0].pack });
        commit('UPDATE_QD_TOTALS_and_DISCOUNT');
      }
    }
    catch (err) {
      commit('SET_ITEM_WEIGHT', { index, pack: [{ error: 'oops' }] });
    }
  },
  async makeSugFastener({ commit, state }, { index, item }) {
    if (!item || !item.pn) return;
    if (item.q && state.fastenersFor.indexOf(item.q.product) === -1) return;
    try {
      // commit('SET_ITEM_SUG_FASTENERS', { index, fasteners: { loading: true } });
      const fasteners = await itemService.makeSugFastener([item]);
      if (fasteners) {
        commit('SET_ITEM_SUG_FASTENERS', { index, fasteners: fasteners[0] });
      }
    }
    catch (err) {
      commit('SET_ITEM_SUG_FASTENERS', { index, pack: [{ error: 'oops' }] });
    }
  },
  updateItemQty({ dispatch, commit }, payload) {
    try {
      commit('SET_ITEM_QTY', payload);
      commit('UPDATE_QD_TOTALS_and_DISCOUNT');
    }
    catch (err) {
      dispatch('alert/error', err || err, { root: true });
    }
  },
  moveItem({ dispatch, commit }, payload) {
    try {
      commit('MOVE_ITEM', payload);
      commit('SET_LINE_NUMBERS', payload);
    }
    catch (err) {
      dispatch('alert/error', err, { root: true });
    }
  },
  removeItem({ dispatch, commit }, index) {
    try {
      dispatch('alert/info', { title: `REMOVED Line: ${index + 1}` }, { root: true });
      commit('REMOVE_ITEM', index);
      commit('SET_SLIDERS');
      commit('UPDATE_QD_TOTALS_and_DISCOUNT');
    }
    catch (err) {
      dispatch('alert/error', err, { root: true });
    }
  },
  setSliderValue({ commit }, payload) {
    // console.log('setSliderValue')
    commit('SET_SLIDER_VALUE', payload);
    for (const index in state.quote.qItems) {
      commit('SET_ITEM_UNIT_PRICE', index);
    }
    commit('UPDATE_QD_TOTALS_and_DISCOUNT');
  },
  updateQD({ commit }, payload) {
    commit('UPDATE_QD', payload);
    if (payload.oKey === 'boltsOnSide') commit('UPDATE_QD_TOTALS_and_DISCOUNT');
  },
  async updateOrigin({ commit, state }, origin) {
    // console.log(state.quote.dist, origin, state.quote.dist !== origin);
    if (state.quote.dist === '') {
      commit('UPDATE_ORIGIN', origin);
    }
    else if (state.quote.dist && state.quote.dist !== origin) {
      commit('UPDATE_QUOTE_PRICING_PENDING');
      commit('UPDATE_ORIGIN', origin);
      for (const index in state.quote.qItems) {
        const { qty } = state.quote.qItems[index];
        const query = state.quote.qItems[index].q;
        // let tempItem = {
        //   pn: '... updating ...',
        //   q: {},
        //   qty,
        // };
        // commit('SET_ITEM_PENDING', { index, tempItem });
        if (query.product === 'charge') continue;
        if (query.product === 'custom') continue;
        const item = await itemService.getItem(encodeURIComponent(JSON.stringify(query)), `?dist=${origin}`);
        commit('SET_ITEM', { index, item, qty });
        commit('SET_SLIDERS');
        commit('SET_ITEM_UNIT_PRICE', index);
      }
      commit('UPDATE_QD_TOTALS_and_DISCOUNT');
      commit('UPDATE_QUOTE_DONE');
    }
  },
};

const mutations = {
  // single quote
  UPDATE_QUOTE_PENDING(state) {
    state.isUpdatePending = true;
    state.quoteError = false;
  },
  SET_QUOTE_PENDING(state) {
    state.isGetPending = true;
    state.isSliderPending = true;
    state.quoteError = false;
    state.quote = currentQuote;
  },
  SET_QUOTE(state, quote) {
    // console.log('old');
    // console.log(state.quote);
    // console.log('new');
    // console.log(quote);
    state.isUpdatePending = false;
    state.isGetPending = false;
    state.quoteError = false;
    state.status = { loaded: true };
    state.quote = quote;
    if (!state.quote.qData.weightNet) {
      state.quote.qData.weightNet = 0;
      state.quote.qData.volumeNet = 0;
    }
    if (!state.quote.qData.customer) state.canSave = false;
    else state.canSave = true;
    if (!state.quote.qData.boltsOnSide) state.quote.qData.boltsOnSide = 'S';
  },
  UPDATE_QUOTE_PRICING_PENDING(state) {
    state.isGetPending = true;
  },
  UPDATE_QUOTE_DONE(state) {
    state.isGetPending = false;
  },
  VERIFY_PENDING(state) {
    state.isGetPending = true;
    state.quoteError = false;
  },
  VERIFY_BOM(state, verify) {
    // console.log(verify);
    state.isGetPending = false;
    state.quoteError = false;
    state.verifiedBOMs = verify;
  },
  VERIFY_MATERIAL(state, verify) {
    // console.log(quote);
    state.isGetPending = false;
    state.quoteError = false;
    state.quote.verifiedMaterials = verify.verifiedMaterials;
  },
  SET_QUOTE_FAILED(state, error) {
    state.isUpdatePending = false;
    state.isGetPending = false;
    // state.status = { error: true };
    state.quoteError = {
      status: error.response.status,
      message: error.response.data,
    };
  },

  // create quote
  CREATE_QUOTE(state) {
    state.status = { registering: true };
  },
  UPDATE_QUOTE(state) {
    state.status = { registering: true };
  },

  // quote line related
  SET_ITEM_PENDING(state, payload) {
    state.isSliderPending = true;
    const { index, item } = payload;
    state.quote.qItems.splice(index, 1, item);
    state.lineStatus[index] = { loading: true };
    if (state.verifiedBOMs && state.verifiedBOMs[index]) {
      state.verifiedBOMs.splice(index, 1, { ...item, vrBom: { items: [], mats: [], ops: [], error: [] } });
    }
  },
  SET_ITEM(state, payload) {
    const { index, item, qty } = payload;
    if (!item.qty) item.qty = qty || 1;
    const multiples = qtyIncrement(item.q);
    console.log(item.q);
    item.qty = Math.ceil(item.qty / multiples) * multiples;
    state.quote.qItems.splice(index, 1, item);
    delete state.lineStatus[index];
  },
  SET_ITEM_WEIGHT(state, { index, pack }) {
    state.quote.qItems[index].pack = pack;
  },
  SET_ITEM_SUG_FASTENERS(state, { index, fasteners }) {
    if (fasteners) {
      fasteners.state = state.quote.qData.boltsOnSide || 'S';
      state.quote.qItems[index].fasteners = { ...fasteners };
    }
  },
  SET_ITEM_VERIFY(state, payload) {
    const { index, item } = payload;
    if (item.vrBom && state.verifiedBOMs && state.verifiedBOMs[index]) {
      state.verifiedBOMs.splice(index, 1, item);
    }
  },
  SET_ITEM_QTY(state, payload) {
    const { index, qty } = payload;
    const updatedItem = state.quote.qItems[index];
    const multiples = qtyIncrement(updatedItem.q);
    updatedItem.qty = Math.ceil(qty / multiples) * multiples;
    // updatedItem.p.net = updatedItem.p.up * qty;
    if (updatedItem.fasteners) updatedItem.fasteners.parentQty = updatedItem.qty;
    state.quote.qItems.splice(index, 1, updatedItem);
    delete state.lineStatus[index];
  },
  REMOVE_ITEM(state, index) {
    state.quote.qItems.splice(index, 1);
  },
  MOVE_ITEM(state, payload) {
    // console.log(payload)
    const { from, to } = payload;
    if (to >= 0 && to < state.quote.qItems.length) state.quote.qItems.splice(to, 0, state.quote.qItems.splice(from, 1)[0]);
  },
  SET_LINE_NUMBERS(state) {
    let index = 1;
    for (const part of state.quote.qItems) {
      part.ln = (index++).toString();
    }
  },
  SET_ITEM_UNIT_PRICE(state, index) {
    const updatedItem = state.quote.qItems[index];
    if (!updatedItem || !updatedItem.p) return;
    // create pointer
    const cst = updatedItem.p;
    const brand = updatedItem.q.brand || updatedItem.q.product;
    if (cst.dist) {
      cst.up = cst[`d${cst.dist}`] || cst.up;
    }
    else if (cst.up && (!cst.sp || !cst.ms)) {
      // do nothing // cst.up = cst.up;
    }
    else if (cst.mh && cst.ms && state.sliderClc[brand]) {
      const calc = state.sliderClc[brand];
      const secBuffer = cst[calc.end] - cst[calc.start];
      // console.log(state.sliderAvg)
      // console.log(calc)
      // console.log(secBuffer)
      if (secBuffer < 0) cst.up = cst[calc.end];
      else cst.up = cst[calc.end] - secBuffer * (1 - calc.percent);
    }
    else if (!cst.up) {
      cst.up = cst.lp;
    }
    // else {
    //   cst.up = cst.lp;
    // }
    updatedItem.p = { ...cst };
  },

  // sliders
  SET_SLIDER_VALUE(state, payload) {
    const { index, key, value } = payload;
    // console.log('estimator - setting slider value')
    // console.log(index, key, value)
    const slider = state.quote.qSliders[index];
    slider[key] = parseInt(value, 10);
    // state.sliderClc[slider.brand] = setSliderClcVal(slider, state.sliderAvg[slider.brand]);
    state.sliderClc[slider.brand] = setSliderClcVal(slider);
  },
  SET_SLIDERS(state) {
    const costList = state.quote.qItems.reduce((tot, item) => {
      if (item.p && item.p.ms && item.p.sp && !item.p.dist) {
        const brand = item.q.brand || item.q.product;
        if (!tot[brand]) tot[brand] = [];
        tot[brand].push(item.p);
      }
      return tot;
    }, {});

    // console.log('costList', costList)
    const sliderBrands = state.quote.qSliders.map(slider => slider.brand);
    for (const brand in costList) {
      const brandCostList = costList[brand];
      if (brandCostList.length > 0) {
        const sliderIndex = state.quote.qSliders.findIndex(slider => slider.brand === brand);
        const newSlider = {
          brand,
          admin: -1,
          value: -1,
          resolution: 10000,
          avg: {},
          ...state.quote.qSliders[sliderIndex],
        };
        // newSlider = state.quote.qSliders[sliderIndex];
        if (!newSlider.resolution) newSlider.resolution = 10000;
        newSlider.avg = brandAverages(brandCostList, newSlider.resolution);
        if (sliderIndex >= 0) state.quote.qSliders.splice(sliderIndex, 1, newSlider);
        else state.quote.qSliders.push(newSlider);
        const brandIndex = sliderBrands.findIndex(b => b === brand);
        delete sliderBrands.splice(brandIndex, 1);
      }
    }
    // check for sliders that are no longer needed...
    for (const brand of sliderBrands) {
      const sliderIndex = state.quote.qSliders.findIndex(slider => slider.brand === brand);
      state.quote.qSliders.splice(sliderIndex, 1);
    }

    state.isSliderPending = false;
  },

  // qData updates
  UPDATE_QD_TOTALS_and_DISCOUNT(state) {
    let totalPrice = 0;
    let totalList = 0;
    let totalPriceHasList = 0;
    let weight = 0;
    let volume = 0;
    const weightError = '';
    let index = 0;
    let fastenerTotal = 0;
    for (const part of state.quote.qItems) {
      part.ln = (index + 1).toString();
      if (part.p) {
        totalPrice += part.p.up * part.qty || 0;
        totalList += part.p.lp * part.qty || 0;
        if (part.fasteners && part.fasteners.state === 'I' && part.fasteners.p) {
          fastenerTotal += part.fasteners.p.up * part.fasteners.qty * part.qty || 0;
          // totalPrice += part.fasteners.p.up * part.fasteners.qty * part.qty || 0;
          // totalList += part.fasteners.p.lp * part.fasteners.qty * part.qty || 0;
        }
        if (part.p.lp) totalPriceHasList += part.p.up * part.qty || 0;
      }
      if (part.pack && !weightError) {
        for (const pc of part.pack) {
          weight += pc.weight * part.qty || 0;
          volume += pc.volume * part.qty || 0;
        }
      }
      index++;
    }

    const qd = state.quote.qData;
    qd.priceList = totalList;
    qd.priceNet = totalPrice;
    qd.weightNet = weight;
    qd.volumeNet = volume;
    if (totalList > 0) {
      qd.discount = (1 - totalPriceHasList / totalList) * 100;
    }
    else qd.discount = '';
    // console.log(totalList, totalPrice, 'discount', qd.discount);
    this.discountPercentage = qd.discount;
    qd.priceNet = totalPrice + fastenerTotal;
  },
  UPDATE_CUSTOMER(state, customer) {
    state.quote.qData.customer = customer;
    if (!state.quote.qData.customer) state.canSave = false;
    else state.canSave = true;
  },
  UPDATE_JOB(state, job) {
    state.quote.qData.job = job;
  },
  UPDATE_ORIGIN(state, dist) {
    state.quote.dist = dist;
  },
  UPDATE_QD(state, { oKey, val }) {
    state.quote.qData[oKey] = val;
    state.quote.qData = { ...state.quote.qData };
    if (oKey === 'boltsOnSide') {
      for (const item of state.quote.qItems) {
        if (item.fasteners && item.fasteners.pn) {
          item.fasteners.state = val;
          item.fasteners = { ...item.fasteners };
        }
      }
    }
  },
};

// UPDATE_SLIDER_ARRAY(state) {
//   const currentBrands = state.quote.qItems.map((item) => {
//     if (!item.q) return false;
//     return item.q.brand;
//   });

//   if ( state.quote.qSliders.length === 0 ) this.SET_SLIDER(brand);
//   else {
//     for (let index in state.quote.qSliders) {
//       let sliderBrand = state.quote.qSliders[index].brand;
//       // slider is no longer needed since the brand is no longer in the quote
//       if (currentBrands.indexOf(sliderBrand) === -1) this.removeSlider(index);
//       // if it is a new brand because some line was update and the slider does not exist
//       else if (brand) this.SET_SLIDER(brand);
//     }
//   }
// },

// updatedUnitPrice(brand) {
//   for (let index in state.quote.qItems) {
//     const part = state.quote.qItems[index]
//     if (!part.q || part.q.brand === undefined) {
//       continue;
//     }
//     if (brand !== undefined && brand !== part.q.brand) {
//       continue;
//     }
//     // this.calculateUnitPrice(part);
//     this.calculateUnitPrice(index);
//   }
// },

const matSort = (m1, m2) => {
  if (m1.mat < m2.mat) return -1;
  if (m1.mat > m2.mat) return 1;
  return 0;
};

// use it only for computed values, other wise state can be used
const getters = {
  lineStatus: state => state.lineStatus,
  quote: state => state.quote,
  quoteError: state => state.quoteError,
  isGetPending: state => state.isGetPending,
  qData: state => state.quote.qData,
  qItems: state => state.quote.qItems,
  qSliders: state => state.quote.qSliders,
  sliderAvgArr: state => state.sliderAvg,
  customer: state => state.quote.qData.customer,
  estimateTotalFormated: state => state.quote.qData.priceNet, // 2); },
  listTotalFormated: state => state.quote.qData.priceList, // 2); },
  boltsOnSide: state => state.quote.qData.boltsOnSide,
  lastUpdatedDate(state) {
    const d = new Date(state.quote.updatedAt);
    return d.toLocaleString();
  },
  leadTime(state) {
    if (state.quote.qData.leadTime) return state.quote.qData.leadTime;
    return '';
  },
  headerTitle(state) {
    if (state.orderNumber) return 'Order';
    if (state.poNumber) return 'PO';
    return 'Quote';
  },
  headerNumber(state) {
    if (state.orderNumber) return state.orderNumber;
    if (state.poNumber) return state.poNumber;
    return state.quote._id;
  },
  qNumber(state) {
    return state.quote._id;
  },
  poNumber(state) {
    return state.quote.po || state.quote.qData.po || '';
  },
  orderNumber(state) {
    return state.quote.order || state.quote.qData.order || '';
  },
  trackingNumber(state) {
    return state.quote.trackingNumber || state.quote.qData.trackingNumber || '';
  },
  shipDate(state) {
    if (!state.quote.shipDate) return '';
    const d = new Date(state.quote.shipDate);
    return d.toLocaleString();
  },
  waterMarketDiscount(state) {
    for (const lineItem of state.quote.qItems) {
      if (['IKC02', 'IKC03'].indexOf(lineItem.pn) === 0) continue;
      const { brand, retMat, seal, sleeveM, isoWasher, retWasher } = lineItem.q;
      if (!waterMarketPromo({ brand, retMat, seal, sleeveM, isoWasher, retWasher })) return false;
    }
    return true;
  },
  // verify bill of material
  verifiedBOMs: state => state.verifiedBOMs,
  // verify materials
  verifiedMaterials: state => state.quote.verifiedMaterials.sort(matSort),
  matInv: state => state.quote.verifiedMaterials.filter(mat => mat.ref === 'Inventory').sort(matSort),
  matNest: state => state.quote.verifiedMaterials.filter(mat => mat.ref === 'Nest').sort(matSort),
  matJob: state => state.quote.verifiedMaterials.filter(mat => mat.ref === 'Job').sort(matSort),
};

const quote = {
  namespaced: true,
  // modules: { slider },
  state,
  actions,
  mutations,
  getters,
};

export default quote;

/**
  * missing functions
  ************************************************************

// expedite
expediteChangeLink() {
  if (!this.quoteModel.qData.expedite && this.quoteModel.qItems[this.quoteModel.qItems.length - 1]){
    this.removeExpeditedFee();
  }
  else if (this.quoteModel.qData.expedite){
    this.addExpeditedFee();
  }
},
addExpeditedFee(){
  this.quoteModel.qItems.push(
    {
      pn: 'expedite',
      desc: '30% of list price',
      c: {
        net: 0,
      }
    }
  )
  this.updateExpediteFee();
},
removeExpeditedFee(){
  let last = this.quoteModel.qItems.length - 1;
  if (this.quoteModel.qItems[last].pn === 'expedite'){
    this.quoteModel.qItems.splice(-1,1)
  }
  console.log(this.quoteModel.qItems)
  this.updateList();
  this.updateNetTotal();
  // this.setShallowPropsWorkAround();
},
updateExpediteFee(){
  let last = this.quoteModel.qItems.length - 1;
  if (this.quoteModel.qItems[last].pn === 'expedite'){
    console.log('update expedite fee: '+ this.quoteModel.qData.priceList)
    this.quoteModel.qItems[last].p.net = this.quoteModel.qData.priceList * 0.3;
  }
  this.updateNetTotal();
  // this.setShallowPropsWorkAround();
},
 */
