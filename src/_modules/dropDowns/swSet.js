
const isoSList = require('./isoSleeve').list;
const isoWList = require('./isoWasher').list;
const retWList = require('./retWasher').list;

// { value: 'G7', text: 'G7', retMat: ['G7'] },
const categories = [
  {
    value: 'swSetToggle',
    label: 'Sleeve and Washer Set',
  },
  {
    value: 'swSet',
    label: '',
    conditions: [{ fKey: 'f_swSet' }],
  },
  // {
  //   value: 'sleeve',
  //   label: '',
  //   conditions: [{ fKey: 'f_swSet' }],
  // },
  // {
  //   value: 'isoWasher',
  //   label: '',
  //   conditions: [{ fKey: 'f_swSet' }],
  // },
  // {
  //   value: 'retWasher',
  //   label: '',
  //   conditions: [{ fKey: 'f_swSet' }],
  // },
];

const sleeveXX = [
  {
    xxKey: 'sleeveL',
    category: 'swSet', label: 'Sleeve Length',
    type: 'number', min: 0.25, max: 72, step: 0.03125,
  },
  {
    xxKey: 'sleeveQ',
    category: 'swSet', label: 'Sleeve Qty',
    type: 'string',
  },
  {
    xxKey: 'sleeveL2',
    category: 'swSet', label: 'Sleeve 2 Length',
    type: 'number', min: 0.25, max: 72, step: 0.03125,
    conditions: [{ xxKey: 'sleeveL' }],
  },
  {
    xxKey: 'sleeveQ2',
    category: 'swSet', label: 'Sleeve 2 Qty',
    type: 'string',
    conditions: [{ xxKey: 'sleeveL2' }],
  },
  {
    xxKey: 'sleeveL3',
    category: 'swSet', label: 'Sleeve 3 Length',
    type: 'number', min: 0.25, max: 72, step: 0.03125,
    conditions: [{ xxKey: 'sleeveL2' }],
  },
  {
    xxKey: 'sleeveQ3',
    category: 'swSet', label: 'Sleeve 3 Qty',
    type: 'string',
    conditions: [{ xxKey: 'sleeveL3' }],
  },
];

const isoWasherXX = [
  {
    xxKey: 'isoWasherQ',
    category: 'swSet', label: 'Isolation Washer Qty',
    type: 'string',
  },
];

const retWasherXX = [
  {
    xxKey: 'retWasherQ',
    category: 'swSet', label: 'Backup Washer Qty',
    type: 'string',
  },
];

const options = [
  {
    fKey: 'f_swSet',
    category: 'swSetToggle', label: '',
    type: 'radio', default: 'DBL', list: [
      { value: '',    text: 'No Set', overwrite: [{ oKey: 'product', val: 'ik_gasket' }] },
      { value: 'DBL', text: 'Double', overwrite: [{ oKey: 'dbl', val: true }, { oKey: 'product', val: 'ik_kit', ifKey: 'product', ifVal: 'ik_gasket' }] },
      { value: 'SNL', text: 'Single', overwrite: [{ oKey: 'dbl', val: false }, { oKey: 'product', val: 'ik_kit', ifKey: 'product', ifVal: 'ik_gasket' }] },
    ],
  },
  // {
  //   oKey: 'brand',
  //   category: 'swSet', label: 'Brand',
  //   type: 'text', default: 'KITS',
  //   required: true,
  //   hidden: true,
  //   conditions: [{ oKey: 'product', val: 'ik_swSet' }],
  // },
  {
    oKey: 'gasketThk',
    category: 'swSet', label: 'Gasket Thickness',
    type: 'select', list: [
      { value: 0.125, text: '1/8" gasket (3mm)', overwrite: [{ oKey: 'hasLube', val: false }], },
      { value: 0.25, text: '1/4" gasket (6mm)', overwrite: [{ oKey: 'hasLube', val: false }], },
    ],
    required: true,
    conditions: [{ oKey: 'product', val: 'ik_swSet' }],
  },
  {
    oKey: 'sleeveM',
    category: 'swSet', label: 'Isolation Sleeve Material',
    type: 'select',  default: 'G10', list: [...isoSList, { value: 'NA', text: 'No Iso. Sleeves' }],
    required: true,
  },
  // ...sleeveXX,
  {
    oKey: 'isoWasher',
    category: 'swSet', label: 'Isolation Washer Material',
    type: 'select', default: 'G10CH', list: [...isoWList, { value: 'NA', text: 'No Iso. Washer' }],
    required: true,
    filterKeys: [{ fKey: 'f_apl', fReq: true, oKey: 'brand', oVal: 'DFS' }],
  },
  // ...isoWasherXX,
  {
    oKey: 'retWasher',
    category: 'swSet', label: 'Backup Washer Material',
    type: 'select', default: 'ZCH', list: [...retWList, { value: 'NA', text: 'No Back Up Washers' }],
    required: true,
  },
  // ...retWasherXX,
  {
    oKey: 'dbl',
    category: 'swSet', label: 'Double Set',
    type: 'checkbox', default: true,
    required: true,
    disabled: true,
    hidden: true,
  },
  {
    oKey: 'hasLube',
    category: 'swSet', label: 'Has Lubricant',
    type: 'checkbox', default: true,
    required: true,
    disabled: true,
    // hidden: true,
  },
  ...sleeveXX,
  ...isoWasherXX,
  ...retWasherXX,
  {
    xxKey: 'gasketQty',
    category: 'swSet', label: 'Gasket Qty Per Kit',
    type: 'number', default: 1, min: 1, step: 1,
    conditions: [{ oKey: 'product', val: 'ik_kit' }],
  }
];

module.exports = {
  categories,
  options,
};
