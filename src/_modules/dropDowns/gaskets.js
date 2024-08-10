
// kamm gaskets
const ki = require('./gaskets/gasket_ki');
const drg = require('./gaskets/gasket_drg');
const dfs = require('./gaskets/gasket_dfs');
// laminated gaskets
const df = require('./gaskets/gasket_df');
const dft = require('./gaskets/gasket_dft');
// other
const ig = require('./gaskets/gasket_ig');
const igs = require('./gaskets/gasket_igs');
const igst = require('./gaskets/gasket_igst');
// sheet gaskets
const im = require('./gaskets/gasket_im');
const ls = require('./gaskets/gasket_ls');
const ms = require('./gaskets/gasket_ms');

const gTypes = [
  { value: 'F', text: 'Ring Type (F)', },
  { value: 'E', text: 'Full Face (E)', maxEOD: 'check' },
];

// filterOther(bO) {
//   if (bO.value === 'IGS' && this.selected.nSize === '0.5') return false; // 0.5" spring not a recommended gasket due to tight seal location
//   return true;
// },

const categories = [
  {
    value: 'gBrand',
    label: 'ISOLATION GASKET',
  },
  ...ig.categories,
  ...ki.categories,
  ...igs.categories,
  ...igst.categories,
  ...drg.categories,
  ...dfs.categories,
  ...dft.categories,
  ...df.categories,
  ...im.categories,
  ...ls.categories,
  ...ms.categories,
];

const options = [
  {
    fKey: 'f_apl',
    category: 'gBrand', label: 'Gasket Application',
    type: 'radio', default: '', list: [
      { value: '',   text: 'Any' },
      { value: 'PW', text: 'Potable Water', overwrite: [{ oKey: 'brand', val: 'IG' }, { oKey: 'retMat', val: 'G10PW' }, { oKey: 'seal', val: 'E' }, { oKey: 'gType', val: 'E' }]  },
      { value: 'FS', text: 'Fire Safe', overwrite: [{ fKey: 'nonFS', val: false }, { oKey: 'gType', val: 'F' }] },
      // { value: 'HT', text: 'High Temp' },
      // { value: 'SM', text: 'Steam' },
    ],
  },
  {
    oKey: 'gType',
    category: 'gBrand', label: 'Gasket Type / Shape',
    type: 'radio', default: 'F', list: gTypes,
    required: true,
  },
  {
    oKey: 'brand',
    category: 'gBrand', label: 'Gasket Brand',
    // type: 'select', default: '', list: brands,
    type: 'select', default: '', list: [
      dfs.gasket,
      df.gasket,
      dft.gasket,
      ig.gasket,
      igs.gasket,
      igst.gasket,
      im.gasket,
      ki.gasket,
      ms.gasket,
      ls.gasket,
      drg.gasket,
    ],
    required: true,
    filterKeys: [
      { fKey: 'f_apl', $in: true, lReq: true },
      { fKey: 'maxPressure', $gt: true, fReq: true },
      { fKey: 'maxFOD', $lt: true, fReq: true, oKey: 'gType', oVal: 'F' },
      { fKey: 'maxEOD', $lt: true, fReq: true, oKey: 'gType', oVal: 'E' },
    ],
    emptyList: 'Sorry no available Gasket<br>for Pipe Spec. options Selected'
  },
  ...ig.options,
  ...ki.options,
  ...igs.options,
  ...igst.options,
  ...drg.options,
  ...dfs.options,
  ...dft.options,
  ...df.options,
  ...im.options,
  ...ls.options,
  ...ms.options,
];

module.exports = {
  categories,
  options,
};
