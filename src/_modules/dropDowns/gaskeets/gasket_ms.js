
// MS   : { gType: 'E', retainer: 'L110', sleeveM: 'M', isoWasher: 'G10CH', retWasher: 'ZCH' }
const gasket = {
  value: 'MS', text: 'Matrix Sheet',
  maxPressure: 4500,  maxFOD: 160,  maxEOD: 160,
  overwrite: [
    { oKey: 'gType', val: 'E' },
    { oKey: 'retMat', val: 'ML110' },
    { oKey: 'sleeveM', val: 'M', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'isoWasher', val: 'G10CH', ifKey: 'product', ifVal: 'ik_kit' },
    { oKey: 'retWasher', val: 'ZCH', ifKey: 'product', ifVal: 'ik_kit' },
  ],
  f_apl: 'PW',
};

const retainers = [
  { value: 'L100', text: 'Lamons PTFE Matrix 100 (NSF)' },
  { value: 'L104', text: 'Lamons PTFE Matrix 104 (NSF)' },
  { value: 'L110', text: 'Lamons PTFE Matrix 110 (NSF)' },
  { value: 'CP',   text: 'Corrugated Profile Matrix' },
];

const categories = [
  {
    value: 'gasket_MS',
    label: '', // label: 'Retainer and Seal Options for',
    conditions: [{ oKey: 'brand', val: 'MS' }],
  },
];

const options = [
  {
    oKey: 'retMat',
    category: 'gasket_MS', label: 'Retainer Core',
    type: 'select', default: 'L110', list: retainers,
    required: true
  },
];

module.exports = {
  categories,
  options,
  gasket,
};
