
// LS   : { gType: 'E', retainer: 'L441', sleeveM: 'M', isoWasher: 'G10CH', retWasher: 'ZCH' }
const gasket = {
  value: 'LS', text: 'Lamons Sheet',
  maxPressure: 4500,  maxFOD: 160,  maxEOD: 160,
  overwrite: [
    // { oKey: 'gType', val: 'E' },
    { oKey: 'retMat', val: 'L441' },
    { oKey: 'sleeveM', val: 'M', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'isoWasher', val: 'G10CH', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'retWasher', val: 'ZCH', ifKey: 'product', ifVal: 'ik_kit' },
  ],
};

const retainers = [
  { value: 'L420', text: 'Lamons 420' },
  { value: 'L441', text: 'Lamons 441' },
  { value: 'L443', text: 'Lamons 443' },
];

const categories = [
  {
    value: 'gasket_LS',
    label: '', // label: 'Retainer and Seal Options for',
    conditions: [{ oKey: 'brand', val: 'LS' }],
  },
];

const options = [
  {
    oKey: 'retMat',
    category: 'gasket_LS', label: 'Retainer Core',
    type: 'select', default: 'L441', list: retainers,
    required: true
  },
];

module.exports = {
  categories,
  options,
  gasket,
};
