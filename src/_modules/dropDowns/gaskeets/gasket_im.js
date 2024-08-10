
// IM   : { gType: 'E', retainer: 'PHF', sleeveM: 'M', isoWasher: 'CPH', retWasher: 'ZCH' }
const gasket = {
  value: 'IM',  text: 'IsoMate',
  maxPressure: 1000, maxFOD: 47.8, maxEOD: 48,
  overwrite: [
    { oKey: 'gType', val: 'E' },
    { oKey: 'retMat', val: 'PHF' },
    { oKey: 'hasLube', val: false, ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'sleeveM', val: 'M', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'isoWasher', val: 'CPH', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'retWasher', val: 'ZCH', ifKey: 'product', ifVal: 'ik_kit' },
  ],
};

const retainers = [
  { value: 'PHF',  text: 'Nitrile Faced Phenolic' },
];

const categories = [
  {
    value: 'gasket_IM',
    label: '', // label: 'Retainer and Seal Options for',
    conditions: [{ oKey: 'brand', val: 'IM' }],
  },
];

const options = [
  {
    oKey: 'retMat',
    category: 'gasket_IM', label: 'Retainer Core',
    type: 'select', default: 'PHF', list: retainers,
    required: true
  },
];

module.exports = {
  categories,
  options,
  gasket,
};
